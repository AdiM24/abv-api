import {sequelize} from "../db/sequelize";
import {
  BankAccount,
  initModels,
  Invoice,
  InvoiceAttributes,
  InvoiceProduct,
  Partner,
  Product,
  UserInvoiceSeries,
  UserPartnerMap
} from "../db/models/init-models";
import {CreateInvoiceDto} from "../dtos/create.invoice.dto";
import {
  CreateInvoiceProductDto,
  InvoiceProductInformation,
  UpdateInvoiceProduct
} from "../dtos/create.invoice-product.dto";
import {Op, WhereOptions} from "sequelize";
import {getDateRangeQuery, getInQuery, getLikeQuery, getStrictQuery} from "../common/utils/query-utils.service";
import UserService from "./user.service";
import UserPartnerMappingService from "./user-partner-mapping.service";
import {Roles} from "../common/enums/roles";

class InvoiceService {
  async getInvoices(decodedJwt: any) {
    const models = initModels(sequelize);

    const queryObject: any = {};

    if (decodedJwt.role !== Roles.Administrator) {
      queryObject.user_id = Number(decodedJwt._id);
    }

    return await models.Invoice.findAll({
      where: queryObject,
      include: [{model: Partner, as: 'buyer'}],
      order: [["created_at_utc", "DESC"], ["number", "DESC"]]
    });
  }

  async getFilteredInvoices(queryParams: any, decodedJwt: any) {
    const models = initModels(sequelize);

    const queryObject = {} as any;

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

    return await models.Invoice.findAll({
      where: {
        [Op.and]: {
          ...queryObject,
        },
      },
      include: [
        {model: Partner, as: 'buyer'},
        {model: Partner, as: 'client'}
      ],
      order: [["created_at_utc", "DESC"], ["number", "DESC"]]
    });
  }

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

    if (invoiceToAdd.type === 'issued') {
      invoiceToAdd.user_id = Number(decodedJwt._id);
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
      invoiceToAdd.created_at_utc = new Date().toUTCString();
      invoiceToAdd.user_id = Number(decodedJwt._id);
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
          {model: Partner, as: "buyer", include: [{model: BankAccount, as: 'BankAccounts'}]},
          {model: Partner, as: "client"}
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
          {model: Product, as: "product"}
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

    return {invoice, productList};
  }

  async updateInvoice(invoiceUpdate: any) {
    const models = initModels(sequelize);

    const existingInvoice = await models.Invoice.findOne({
      where: {
        invoice_id: invoiceUpdate.invoice_id
      }
    });

    existingInvoice.buyer_id = invoiceUpdate.buyer;
    existingInvoice.created_at_utc = new Date(invoiceUpdate.created_at).toUTCString();
    existingInvoice.deadline_at_utc = invoiceUpdate.deadline_at ? new Date(invoiceUpdate.deadline_at).toUTCString() : null;
    existingInvoice.series = invoiceUpdate.series;
    existingInvoice.number = invoiceUpdate.number;
    existingInvoice.status = invoiceUpdate.status;
    existingInvoice.sent_status = invoiceUpdate.sent_status;

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
      return {errorCode: 400, message: err}
    }

    return {message: "Invoice update successful"}
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
          return {message: 'Invalid invoice type'}
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

      return {message: "Invoice product successfully updated"};
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
      return {message: "Invoice successfully updated"};
    }

    if (existingInvoice.type === 'issued' || existingInvoice.type === 'notice') {
      existingProduct.quantity = parseFloat((Number(existingProduct.quantity) + Number(existingInvoiceProduct.quantity)).toFixed(2));
    }

    if (existingInvoice.type === 'received') {
      existingProduct.quantity = parseFloat((Number(existingProduct.quantity) - Number(existingInvoiceProduct.quantity)).toFixed(2));
    }

    try {
      await existingProduct.save();
      return {message: "Invoice and product successfully updated"}
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

    try {
      await existingProduct.save();
      await existingInvoiceProduct.save();
      await existingInvoice.save();

      return {code: 200, message: 'Update was successful'};
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
      await existingInvoice.destroy();

      return {code: 200, message: `Invoice successfully deleted`}
    } catch (err) {
      return {code: 500, message: `Factura nu poate fi stearsa.`}
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
}

export default new InvoiceService();
