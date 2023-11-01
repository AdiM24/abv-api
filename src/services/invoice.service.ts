import { sequelize } from "../db/sequelize";
import {
  Address,
  BankAccount,
  initModels,
  Invoice,
  InvoiceAttributes,
  InvoiceProduct,
  Order,
  Partner,
  PartnerAttributes,
  Product,
  UserInvoiceSeries,
  UserPartnerMap
} from "../db/models/init-models";
import { CreateInvoiceDto } from "../dtos/create.invoice.dto";
import {
  CreateInvoiceProductDto,
  InvoiceProductInformation,
  UpdateInvoiceProduct
} from "../dtos/create.invoice-product.dto";
import { Includeable, Op, Transaction, WhereOptions } from "sequelize";
import { getDateRangeQuery, getInQuery, getLikeQuery, getStrictQuery } from "../common/utils/query-utils.service";
import UserService from "./user.service";
import UserPartnerMappingService from "./user-partner-mapping.service";
import { Roles } from "../common/enums/roles";
import { calculatePercentage } from "./utils.service";
import partnerService from './partner.service';

class InvoiceService {
  async getInvoices(decodedJwt: any) {
    const models = initModels(sequelize);

    const queryObject: any = {};

    if (decodedJwt.role !== Roles.Administrator) {
      queryObject.user_id = Number(decodedJwt._id);
    }

    return await models.Invoice.findAll({
      where: queryObject,
      include: [
        { model: Partner, as: 'buyer' },
        { model: Order, as: 'order_reference' },
        { model: Address, as: 'pickup_address' },
        { model: Address, as: 'drop_off_address' }
      ],
      order: [["created_at_utc", "DESC"], ["number", "DESC"]]
    });
  }

  async getFilteredInvoices(queryParams: any, decodedJwt: any) {
    const models = initModels(sequelize);
    const queryObject = {} as any;
    const invoiceProductQuery = {} as any;
    const productQuery = {} as any;
    const pickupQuery = {} as any;
    const dropOffQuery = {} as any;

    const userPartnerIds = (await UserPartnerMappingService.getUserPartnerMappings(Number(decodedJwt._id))).map(
      (userPartner: UserPartnerMap) => userPartner.partner_id);

    if (queryParams.type) {
      queryObject.type = getStrictQuery(queryParams.type);

      if (queryParams.type === 'issued') {
        queryObject.client_id = getInQuery(userPartnerIds);
      } else if (queryParams.type === 'received') {
        queryObject.buyer_id = getInQuery(userPartnerIds);
      }
    }

    if (queryParams.series) {
      queryObject.series = getLikeQuery(queryParams.series);
    }

    if (queryParams.number) {
      queryObject.number = getStrictQuery(queryParams.number);
    }

    if (queryParams.created_from || queryParams.created_to) {
      queryObject.created_at_utc = getDateRangeQuery(queryParams.created_from, queryParams.created_to);
    }

    if (decodedJwt.role !== Roles.Administrator) {
      queryObject.user_id = Number(decodedJwt._id);
    }

    if (queryParams.unit_of_measure) {
      invoiceProductQuery.unit_of_measure = getStrictQuery(queryParams.unit_of_measure);
    }

    if (queryParams.product_name) {
      productQuery.product_name = getLikeQuery(queryParams.product_name);
    }

    if (queryParams.drop_off_location) {
      dropOffQuery.nickname = getLikeQuery(queryParams.drop_off_location);
    }

    if (queryParams.pick_up_location) {
      pickupQuery.nickname = getLikeQuery(queryParams.pick_up_location);
    }

    const relations: Includeable | Includeable[] = [
      { model: Partner, as: 'buyer' },
      { model: Partner, as: 'client' },
      { model: Order, as: 'order_reference' },
    ];

    if (queryParams.type === 'notice') {
      relations.push({
        model: InvoiceProduct,
        as: 'InvoiceProducts',
        required: true,
        include: [
          {
            model: Product,
            as: 'product',
            where: {
              [Op.and]: {
                ...productQuery
              }
            }
          }
        ],
        where: {
          [Op.and]: {
            ...invoiceProductQuery
          }
        }
      });
      relations.push({
        model: Address, as: 'pickup_address', where: {
          [Op.and]: {
            ...pickupQuery
          }
        }
      });
      relations.push({
        model: Address, as: 'drop_off_address', where: {
          [Op.and]: {
            ...dropOffQuery
          }
        }
      })
    }

    return await models.Invoice.findAll({
      include: relations,
      where: {
        [Op.and]: {
          ...queryObject,
        },
      },
      order: [["created_at_utc", "DESC"], ["number", "DESC"]]
    });
  }

  async createNotice(noticeToAdd: any, token: any) {
    const models = initModels(sequelize);

    try {
      await sequelize.transaction(async (transaction: Transaction) => {
        const notice: InvoiceAttributes = {} as InvoiceAttributes;

        const dropOffAddress = noticeToAdd.drop_off_address;
        const pickupAddress = noticeToAdd.pickup_address;
        const [dropOff, dropOffCreated] = await models.Address.findOrCreate({
          where: {
            nickname: dropOffAddress.nickname
          },
          defaults: {
            nickname: dropOffAddress.nickname
          },
          transaction
        });

        const [pickup, pickUpCreated] = await models.Address.findOrCreate({
          where: {
            nickname: pickupAddress.nickname
          },
          defaults: {
            nickname: pickupAddress.nickname
          },
          transaction
        });

        if (dropOffCreated) {
          notice.drop_off_address_id = dropOff.address_id;
          notice.notice_status = 'Incomplet';
        } else {
          notice.drop_off_address_id = dropOff.address_id;
          notice.buyer_id = dropOff.partner_id;
        }

        if (pickUpCreated) {
          notice.pickup_address_id = pickup.address_id;
          notice.notice_status = 'Incomplet'
        } else {
          notice.pickup_address_id = pickup.address_id;
          notice.client_id = pickup.partner_id;
        }

        if (notice.client_id && notice.buyer_id) notice.notice_status = 'Complet';

        notice.type = noticeToAdd.type;
        notice.car_reg_number = noticeToAdd.reg_no;
        notice.created_at_utc = new Date(Date.now()).toLocaleString();
        notice.user_id = Number(token._id);
        notice.series = (await UserService.getUserSeries(token._id, 'notice', true) as UserInvoiceSeries).series;
        notice.number = await this.findNextSeriesNumber(notice.series, notice.type);
        notice.status = noticeToAdd.status;
        notice.deadline_at_utc = null;
        notice.driver_name = token.name;
        notice.observation = noticeToAdd.observation;

        const createdNotice = await models.Invoice.create(notice, { transaction, returning: true });
        const product = await models.Product.findOne({ where: { product_id: Number(noticeToAdd.product_id) } });

        const invoiceProduct: CreateInvoiceProductDto = {
          invoice_id: createdNotice.get('invoice_id'),
          product_id: product.product_id,
          quantity: parseFloat(Number(noticeToAdd.quantity).toFixed(2)),
          selling_price: parseFloat(Number(product.purchase_price).toFixed(2)),
          sold_at_utc: new Date(Date.now()).toLocaleString(),
          unit_of_measure: noticeToAdd.unit_of_measure
        }

        createdNotice.total_price = parseFloat((Number(product.purchase_price) * Number(invoiceProduct.quantity)).toFixed(2))
        createdNotice.total_vat = parseFloat((calculatePercentage(Number(createdNotice.total_price), Number(product.vat)) - createdNotice.total_price).toFixed(2));
        createdNotice.total_price_incl_vat = parseFloat((createdNotice.total_price + createdNotice.total_vat).toFixed(2));

        product.quantity = Number(product.quantity) - Number(noticeToAdd.quantity);

        await product.save({ transaction });
        await models.InvoiceProduct.create(invoiceProduct, { transaction });
        await createdNotice.save({ transaction });
      });
    } catch (err) {
      console.error(err);
      return { code: 500, message: err.message }
    }

    return { code: 201, message: 'Avizul a fost creat' }
  }

  // async updateNotice(noticeToUpdate: any, token: any) {
  //   const model = initModels(sequelize);
  //
  //
  // }

  async createInvoice(invoiceToAdd: CreateInvoiceDto, models: any) {
    let createdInvoice: Invoice;

    invoiceToAdd.series = invoiceToAdd.series.toUpperCase();
    invoiceToAdd.deadline_at_utc = invoiceToAdd.deadline_at_utc ? invoiceToAdd.deadline_at_utc : null;

    try {
      createdInvoice = await models.Invoice.create(invoiceToAdd);
    } catch (err) {
      console.error(err);
    }

    return createdInvoice;
  }

  async addInvoice(invoiceToAdd: CreateInvoiceDto, decodedJwt: any = undefined) {
    const models = initModels(sequelize);

    invoiceToAdd.user_id = Number(decodedJwt._id);

    if (invoiceToAdd.type === 'issued') {
      invoiceToAdd.number = await this.findNextSeriesNumber(invoiceToAdd.series, invoiceToAdd.type);
    }

    if (invoiceToAdd.type === 'notice') {
      invoiceToAdd.series = (await UserService.getUserSeries(decodedJwt._id, 'notice', true) as UserInvoiceSeries).series;
      invoiceToAdd.number = await this.findNextSeriesNumber(invoiceToAdd.series, invoiceToAdd.type);
      invoiceToAdd.client_id = invoiceToAdd.pickup_address.partner_id;
      invoiceToAdd.buyer_id = invoiceToAdd.drop_off_address.partner_id;
      invoiceToAdd.pickup_address_id = invoiceToAdd.pickup_address.address_id;
      invoiceToAdd.drop_off_address_id = invoiceToAdd.drop_off_address.address_id;
      invoiceToAdd.car_reg_number = invoiceToAdd.car_reg_number.replace(/ /g, '').toUpperCase();
      invoiceToAdd.driver_name = decodedJwt.name;
      invoiceToAdd.created_at_utc = new Date(Date.now()).toLocaleDateString('ro-RO');
    }

    const createdInvoice = await this.createInvoice(invoiceToAdd, models);

    const invoiceProducts: CreateInvoiceProductDto[] = invoiceToAdd.products.map((invoiceProduct: CreateInvoiceProductDto) => {
      return {
        invoice_id: createdInvoice.get().invoice_id,
        product_id: invoiceProduct.product_id,
        quantity: parseFloat(Number(invoiceProduct.quantity).toFixed(2)),
        selling_price: parseFloat(Number(invoiceProduct.selling_price).toFixed(2)),
        sold_at_utc: new Date().toUTCString()
      }
    });

    try {
      invoiceProducts.map((invoiceProduct: CreateInvoiceProductDto) => {
        models.InvoiceProduct.create(invoiceProduct);
      })
    } catch (err) {
      console.error(err);
    }

    createdInvoice.total_vat = 0;
    createdInvoice.total_price = 0;
    createdInvoice.total_price_incl_vat = 0;

    invoiceProducts.map((invoiceProduct: CreateInvoiceProductDto) => {
      createdInvoice.total_vat += parseFloat((((invoiceProduct.selling_price * 19) / 100) * invoiceProduct.quantity).toFixed(2));
      createdInvoice.total_price += parseFloat((invoiceProduct.selling_price * invoiceProduct.quantity).toFixed(2));
    });

    createdInvoice.total_price_incl_vat = parseFloat((createdInvoice.total_vat + createdInvoice.total_price).toFixed(2));

    try {
      await createdInvoice.save();
    } catch (err) {
      console.error(err);
    }

  }

  async findInvoice(condition: WhereOptions<InvoiceAttributes>) {
    const models = initModels(sequelize);

    return await models.Invoice.findOne({
      where: condition
    });
  }

  async findNextSeriesNumber(series: string, type: string) {
    const models = initModels(sequelize);

    const latestInvoiceNumberForSeries = (await models.Invoice.findOne({
      where: {
        series: series.toUpperCase(),
        type: type
      },
      order: [["number", "DESC"]]
    }))?.get('number');

    if (!latestInvoiceNumberForSeries) {
      return 1;
    }

    return Number(latestInvoiceNumberForSeries) + 1;
  }

  async getInvoiceWithDetails(invoiceId: number) {
    const models = initModels(sequelize);

    const invoice: Invoice = await models.Invoice.findOne(
      {
        where: {
          invoice_id: invoiceId
        },
        include: [
          { model: Partner, as: "buyer", include: [{ model: BankAccount, as: 'BankAccounts' }] },
          { model: Partner, as: "client", include: [{ model: BankAccount, as: 'BankAccounts' }] },
          { model: Address, as: 'pickup_address' },
          { model: Address, as: 'drop_off_address' }
        ],
        order: [["created_at_utc", "DESC"]]
      }
    );

    const invoiceProducts = await models.InvoiceProduct.findAll(
      {
        where: {
          invoice_id: invoiceId
        },
        include: [
          { model: Product, as: "product" }
        ]
      }
    );

    const productList: any[] = [];

    invoiceProducts.forEach((invoiceProduct: InvoiceProduct) => {
      const product: any = invoiceProduct.product;

      product.dataValues.invoice_product_id = invoiceProduct.invoice_product_id;
      product.dataValues.quantity = parseFloat(Number(invoiceProduct.quantity).toFixed(2));
      product.dataValues.purchase_price = parseFloat(Number(invoiceProduct.selling_price).toFixed(2));

      productList.push(product)
    });

    return { invoice, productList };
  }

  async updateInvoice(invoiceUpdate: any) {
    const models = initModels(sequelize);

    const existingInvoice = await models.Invoice.findOne({
      where: {
        invoice_id: invoiceUpdate.invoice_id
      }
    });

    if (existingInvoice.type === 'notice') {
      existingInvoice.buyer_id = Number(invoiceUpdate?.drop_off_address?.partner_id) || undefined;
    } else {
      existingInvoice.buyer_id = invoiceUpdate.buyer_id;
    }

    existingInvoice.deadline_at_utc = invoiceUpdate.deadline_at_utc ? new Date(invoiceUpdate.deadline_at_utc).toUTCString() : null;
    existingInvoice.series = invoiceUpdate.series;
    existingInvoice.number = Number(invoiceUpdate.number);
    existingInvoice.status = invoiceUpdate.status;
    existingInvoice.sent_status = invoiceUpdate.sent_status;
    existingInvoice.drop_off_address_id = invoiceUpdate.drop_off_address_id ? Number(invoiceUpdate.drop_off_address_id) : undefined;
    existingInvoice.pickup_address_id = invoiceUpdate.pickup_address_id ? Number(invoiceUpdate.pickup_address_id) : undefined;
    existingInvoice.driver_info = invoiceUpdate.driver_info;
    existingInvoice.car_reg_number = invoiceUpdate.car_reg_number;
    existingInvoice.observation = invoiceUpdate.observation;

    if (existingInvoice.type === 'order') {
      if (invoiceUpdate.currency === 'RON') {
        existingInvoice.total_price_incl_vat = parseFloat((Number(invoiceUpdate.total_price) + (Number(invoiceUpdate.total_price) * 19.0 / 100.0)).toFixed(2))
      }

      if (invoiceUpdate.currency === 'EUR') {
        existingInvoice.total_price_incl_vat = invoiceUpdate.total_price
      }

      existingInvoice.driver_info = invoiceUpdate.driver_info;
      existingInvoice.car_reg_number = invoiceUpdate.car_reg_number;
    }

    try {
      await existingInvoice.save();
    } catch (err) {
      console.error(err);
      return { errorCode: 400, message: err }
    }

    return { message: "Invoice update successful" }
  }

  async addInvoiceProduct(productData: InvoiceProductInformation) {
    const models = initModels(sequelize);

    const existingProduct: Product = await models.Product.findOne({
      where: {
        product_id: productData.product_id
      }
    });

    const existingInvoice: Invoice = await models.Invoice.findOne({
      where: {
        invoice_id: productData.invoice_id
      }
    });

    const existingInvoiceProduct: InvoiceProduct = await models.InvoiceProduct.findOne({
      where: {
        product_id: productData.product_id,
        invoice_id: productData.invoice_id
      }
    });

    let invoiceProduct = existingInvoiceProduct;

    if (existingInvoiceProduct) {
      invoiceProduct.quantity = parseFloat((Number(existingInvoiceProduct.quantity) + Number(productData.quantity)).toFixed(2));
      switch (existingInvoice.type) {
        case 'received': {
          existingProduct.quantity = parseFloat((Number(existingProduct.quantity) + Number(productData.quantity)).toFixed(2));

          break;
        }

        case 'issued': {
          existingProduct.quantity = parseFloat((Number(existingProduct.quantity) - Number(productData.quantity)).toFixed(2));

          break;
        }

        default: {
          console.error(`Invalid invoice type, ${existingInvoice}`)
          return { message: 'Invalid invoice type' }
        }
      }
    } else {
      invoiceProduct = await models.InvoiceProduct.create({
        product_id: existingProduct.product_id,
        invoice_id: existingInvoice.invoice_id,
        quantity: parseFloat(Number(productData.quantity).toFixed(2)),
        selling_price: parseFloat(Number(productData.purchase_price).toFixed(2)),
        sold_at_utc: new Date().toUTCString()
      })
    }

    const productVat = parseFloat((((invoiceProduct.selling_price * 19) / 100) * invoiceProduct.quantity).toFixed(2))
    existingInvoice.total_vat = Number((Number(existingInvoice.total_vat) + productVat).toFixed(2));
    existingInvoice.total_price = Number(Number(existingInvoice.total_price) + parseFloat((invoiceProduct.selling_price * invoiceProduct.quantity).toFixed(2)));
    existingInvoice.total_price_incl_vat = Number((existingInvoice.total_vat + existingInvoice.total_price).toFixed(2));

    try {
      await existingInvoice.save();
      await invoiceProduct.save();
      await existingProduct.save();

      return { message: "Invoice product successfully updated" };
    } catch (error) {
      console.error(error);
    }
  }

  async removeInvoiceProduct(productData: InvoiceProductInformation) {
    const models = initModels(sequelize);

    const existingInvoiceProduct: InvoiceProduct = await models.InvoiceProduct.findOne({
      where: {
        product_id: productData.product_id,
        invoice_id: productData.invoice_id
      }
    });

    const existingInvoice: Invoice = await models.Invoice.findOne({
      where: {
        invoice_id: productData.invoice_id
      }
    });

    const existingProduct: Product = await models.Product.findOne({
      where: {
        product_id: productData.product_id
      }
    })

    try {
      const productVat = parseFloat((((existingInvoiceProduct.selling_price * 19) / 100) * existingInvoiceProduct.quantity).toFixed(2))

      existingInvoice.total_vat = Number((Number(existingInvoice.total_vat) - productVat).toFixed(2));
      existingInvoice.total_price = Number(Number(existingInvoice.total_price) - parseFloat((existingInvoiceProduct.selling_price * existingInvoiceProduct.quantity).toFixed(2)));
      existingInvoice.total_price_incl_vat = Number((existingInvoice.total_vat + existingInvoice.total_price).toFixed(2));

      await existingInvoice.save();
      await existingInvoiceProduct.destroy();
    } catch (error) {
      console.error(error);
    }

    if (existingProduct.type === 'service') {
      return { message: "Invoice successfully updated" };
    }

    if (existingInvoice.type === 'issued' || existingInvoice.type === 'notice') {
      existingProduct.quantity = parseFloat((Number(existingProduct.quantity) + Number(existingInvoiceProduct.quantity)).toFixed(2));
    }

    if (existingInvoice.type === 'received') {
      existingProduct.quantity = parseFloat((Number(existingProduct.quantity) - Number(existingInvoiceProduct.quantity)).toFixed(2));
    }

    try {
      await existingProduct.save();
      return { message: "Invoice and product successfully updated" }
    } catch (error) {
      console.error(error);
    }
  }

  async updateInvoiceProduct(invoiceProduct: UpdateInvoiceProduct) {
    const models = initModels(sequelize);

    const existingInvoice = await models.Invoice.findOne({
      where: {
        invoice_id: invoiceProduct.invoice_id
      }
    });

    const existingInvoiceProduct = await models.InvoiceProduct.findOne({
      where: {
        invoice_product_id: invoiceProduct.invoice_product_id
      }
    });

    const existingProduct = await models.Product.findOne({
      where: {
        product_id: invoiceProduct.product_id
      }
    })

    const oldVat = parseFloat(((Number(existingInvoiceProduct.selling_price) * 19 / 100) * Number(existingInvoiceProduct.quantity)).toFixed(2));
    const oldPrice = parseFloat((Number(existingInvoiceProduct.selling_price) * Number(existingInvoiceProduct.quantity)).toFixed(2));

    const newVat = parseFloat(((Number(invoiceProduct.purchase_price) * 19 / 100) * Number(invoiceProduct.quantity)).toFixed(2));
    const newPrice = parseFloat((Number(invoiceProduct.purchase_price) * Number(invoiceProduct.quantity)).toFixed(2));

    if (existingInvoice.type === 'received') {
      existingProduct.quantity = parseFloat((Number(existingProduct.quantity) - Number(existingInvoiceProduct.quantity)).toFixed(2));
      existingProduct.quantity = parseFloat((Number(existingProduct.quantity) + Number(invoiceProduct.quantity)).toFixed(2));
    } else {
      existingProduct.quantity = parseFloat((Number(existingProduct.quantity) + Number(existingInvoiceProduct.quantity)).toFixed(2));
      existingProduct.quantity = parseFloat((Number(existingProduct.quantity) - Number(invoiceProduct.quantity)).toFixed(2));
    }

    existingInvoice.total_vat = parseFloat((Number(existingInvoice.total_vat) - oldVat + newVat).toFixed(2));
    existingInvoice.total_price = parseFloat((Number(existingInvoice.total_price) - oldPrice + newPrice).toFixed(2));
    existingInvoice.total_price_incl_vat = parseFloat((existingInvoice.total_price + existingInvoice.total_vat).toFixed(2));

    existingInvoiceProduct.quantity = parseFloat(Number(invoiceProduct.quantity).toFixed(2));
    existingInvoiceProduct.selling_price = parseFloat(Number(invoiceProduct.purchase_price).toFixed(2));
    existingInvoiceProduct.unit_of_measure = invoiceProduct.unit_of_measure;

    existingProduct.unit_of_measure = invoiceProduct.unit_of_measure;

    try {
      await existingProduct.save();
      await existingInvoiceProduct.save();
      await existingInvoice.save();

      return { code: 200, message: 'Update was successful' };
    } catch (err) {
      console.error(err);
    }
  }

  async checkInvoiceProductExists(invoiceId: number, productId: number) {
    const models = initModels(sequelize);

    return !!(await models.InvoiceProduct.findOne({
      where: {
        product_id: productId,
        invoice_id: invoiceId
      }
    }))
  }

  async removeInvoice(invoiceId: number) {
    const models = initModels(sequelize);

    const existingInvoice = await models.Invoice.findOne({
      where: {
        invoice_id: invoiceId
      },
    });

    const invoiceProducts = await models.InvoiceProduct.findAll({
      where: {
        invoice_id: invoiceId,
      }
    });

    for await (const invoiceProduct of invoiceProducts) {
      const product = await models.Product.findOne({
        where: {
          product_id: invoiceProduct.product_id,
        }
      });

      if (product.type === 'goods') {

        if (existingInvoice.type === 'received') {
          product.quantity = parseFloat((Number(product.quantity) - Number(invoiceProduct.quantity)).toFixed(2));
        }

        if (existingInvoice.type === 'issued' || existingInvoice.type === 'notice') {
          product.quantity = parseFloat((Number(product.quantity) + Number(invoiceProduct.quantity)).toFixed(2));
        }
      }

      try {
        await product.save();
        await models.InvoiceProduct.destroy({
          where: {
            invoice_id: invoiceProduct.invoice_id,
            product_id: invoiceProduct.product_id
          }
        });
      } catch (err) {
        console.error(err);
      }
    }

    try {
      const orderReference = existingInvoice.order_reference_id;
      await existingInvoice.destroy();

      if (orderReference) {
        const existingOrder = await models.Order.findOne({
          where: {
            order_id: orderReference
          }
        });

        existingOrder.invoice_generated = false;

        await existingOrder.save();
      }

      return { code: 200, message: `Invoice successfully deleted` }
    } catch (err) {
      return { code: 500, message: `Factura nu poate fi stearsa.` }
    }

  }

  async getLatestInvoiceBySeries(invoiceSeries: string) {
    const models = initModels(sequelize);

    const latestInvoicesFromSeries = await models.Invoice.findAll({
      where: {
        series: invoiceSeries
      },
      order: [
        ['created_at_utc', 'DESC']
      ]
    });

    if (!latestInvoicesFromSeries?.length) {
      return null
    }

    return latestInvoicesFromSeries[0];
  }

  async sendInvoice(invoiceId: any) {
    const { invoice, productList } = await this.getInvoiceWithDetails(invoiceId);
    const supplier = await partnerService.getPartner(invoice.client_id) as PartnerAttributes;
    // Solution for the moment because only one ID exists
    const customer = await partnerService.getPartner(1) as PartnerAttributes;

    const invoiceLines = productList.map(product => {
      return {
        unitCode: "C62",
        invoicedQuantity: product.quantity,
        name: product.product_name,
        classifiedTaxCategory: "S",
        classifiedTaxPercent: product.vat,
        priceAmount: product.purchase_price,
        baseQuantity: product.quantity
      }
    });

    const microServiceUrl = process.env["MICROSERVICE_URL"] || "http://127.0.0.1:5050";

    const sendInvoice = await fetch(`${microServiceUrl}/api/anaf/send-efactura`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      // Dynamic fields - it will work only if VAT are correct and CIF exists on anaf SPV
      // body: JSON.stringify({
      //   cif: supplier.unique_identification_number,
      //   headers: {
      //     invoiceId: invoice.invoice_id,
      //     issueDate: invoice.created_at_utc,
      //     dueDate: (invoice.deadline_at_utc ? invoice.deadline_at_utc : "2023-12-31"),
      //     currencyCode: invoice.currency
      //   },
      //   supplierInfo: {
      //     supplierName: supplier.name,
      //     supplierStreet: "line1",
      //     supplierCity: "SECTOR1",
      //     supplierCountrySubentity: "RO-B",
      //     supplierCountryCode: "RO",
      //     supplierId: supplier.unique_identification_number,
      //     supplierLegallyInfo: supplier.trade_register_registration_number
      //   },
      //   customerInfo: {
      //     customerName: customer.name,
      //     customerStreet: "street1",
      //     customerCity: "SECTOR3",
      //     customerCountrySubentity: "RO-AR",
      //     customerCountryCode: "RO",
      //     customerId: customer.unique_identification_number,
      //     customerRegistrationName: customer.trade_register_registration_number
      //   },
      //   paymentMeans: {
      //     paymentMeansCode: "31"
      //   },
      //   taxTotal: {
      //     taxAmount: invoice.total_vat,
      //     currency: invoice.currency,
      //     taxSubtotal: {
      //       taxableAmount: invoice.total_price,
      //       subtotalTaxAmount: invoice.total_vat,
      //       taxCategory: "S",
      //       taxPercent: "19.00"
      //     }
      //   },
      //   legalMonetaryTotal: {
      //     lineExtensionAmount: invoice.total_price,
      //     taxExclusiveAmount: invoice.total_price,
      //     taxInclusiveAmount: invoice.total_price_incl_vat,
      //     payableAmount: invoice.total_price_incl_vat
      //   },
      //   invoiceLines: invoiceLines
      // })

      // Testing purpose with correct data - dummy
      body: JSON.stringify({
        cif: "16912984",
        headers: {
          invoiceId: "6422451356",
          issueDate: "2024-05-30",
          dueDate: "2024-05-30",
          notes: "some notes for invoice",
          currencyCode: "RON"
        },
        supplierInfo: {
          supplierName: "Seller SRL",
          supplierStreet: "line1",
          supplierCity: "SECTOR1",
          supplierCountrySubentity: "RO-B",
          supplierCountryCode: "RO",
          supplierId: "RO42350206",
          supplierLegallyInfo: "J40/12345/1998"
        },
        customerInfo: {
          customerName: "Customer name",
          customerStreet: "street1",
          customerCity: "SECTOR3",
          customerCountrySubentity: "RO-AR",
          customerCountryCode: "RO",
          customerId: "RO42350206",
          customerRegistrationName: "Customer SRL"
        },
        paymentMeans: {
          paymentMeansCode: "31"
        },
        taxTotal: {
          taxAmount: "5.14",
          currency: "RON",
          taxSubtotal: {
            taxableAmount: "27.00",
            subtotalTaxAmount: "5.14",
            taxCategory: "S",
            taxPercent: "19.00"
          }
        },
        legalMonetaryTotal: {
          lineExtensionAmount: "27.00",
          taxExclusiveAmount: "27.00",
          taxInclusiveAmount: "32.14",
          payableAmount: "32.14"
        },
        invoiceLines: [
          {
            unitCode: "C62",
            invoicedQuantity: "35.00",
            lineExtensionAmount: "13.50",
            name: "item1",
            classifiedTaxCategory: "S",
            classifiedTaxPercent: "19.00",
            priceAmount: "0.3857",
            baseQuantity: "1"
          },
          {
            unitCode: "C62",
            invoicedQuantity: "20.00",
            lineExtensionAmount: "13.50",
            name: "item2",
            sellersItemIdentification: "0520",
            classifiedTaxCategory: "S",
            classifiedTaxPercent: "19.00",
            priceAmount: "0.3857",
            baseQuantity: "1"
          }
        ]
      })
    });

    const anafResponse = await sendInvoice.json();
    try {
      invoice.index_incarcare_anaf = anafResponse.indexIncarcare;
      invoice.status_incarcare_anaf = true;
      await invoice.save();
    } catch (err) {
      console.log(err);
    }

    return anafResponse;
  }
}

export default new InvoiceService();
