import {sequelize} from "../db/sequelize";
import {
  BankAccount, Contact,
  initModels,
  Invoice,
  InvoiceAttributes,
  InvoiceProduct,
  OrderDetails,
  OrderGoods,
  Partner,
  Product,
  UserInvoiceSeries
} from "../db/models/init-models";
import {CreateInvoiceDto} from "../dtos/create.invoice.dto";
import {
  CreateInvoiceProductDto,
  InvoiceProductInformation,
  UpdateInvoiceProduct
} from "../dtos/create.invoice-product.dto";
import {Op, WhereOptions} from "sequelize";
import {getInQuery, getStrictQuery} from "../common/utils/query-utils.service";
import UserService from "./user.service";
import PartnerService from "./partner.service";

class InvoiceService {
  async getInvoices() {
    const models = initModels(sequelize);

    return await models.Invoice.findAll({
      include: [{model: Partner, as: 'buyer'}]
    });
  }

  async getFilteredInvoices(queryParams: any, decodedJwt: any) {
    const models = initModels(sequelize);

    const queryObject = {} as any;

    const userPartners = (await PartnerService.getUserPartners(decodedJwt._id))
      ?.map((userPartner: Partner) => userPartner.partner_id);

    if (queryParams.type) {
      queryObject.type = getStrictQuery(queryParams.type);
      if (queryParams.type === 'issued') {
        queryObject.client_id = getInQuery(userPartners);
      } else if (queryParams.type === 'received') {
        queryObject.buyer_id = getInQuery(userPartners);
      }
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
      order: [["created_at_utc", "DESC"]]
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

  async updateOrderDetails(orderData: any) {
    const models = initModels(sequelize);

    const existingOrderDetails = await models.OrderDetails.findOne({
      where: {
        order_details_id: orderData.order_details_id
      }
    });

    existingOrderDetails.pick_up_address = orderData.pick_up_address;
    existingOrderDetails.drop_off_address = orderData.drop_off_address;
    existingOrderDetails.pick_up_date = orderData.pick_up_date;
    existingOrderDetails.drop_off_date = orderData.drop_off_date;
    existingOrderDetails.remarks = orderData.remarks;

    await existingOrderDetails.save();

    if (orderData.products && orderData.products.length > 0) {
      await Promise.all(orderData.products.map(async (product: any) => {
        if (product.order_goods_id) {
          const existingOrderGoods = await models.OrderGoods.findOne({
            where: {
              order_goods_id: product.order_goods_id
            }
          });

          await existingOrderGoods.update(product);
        } else {
          await models.OrderGoods.create({
            order_details_id: existingOrderDetails.order_details_id,
            ...product
          })
        }
      }))
    }

    return {code: 200, message: 'Detaliile comenzii au fost actualizate'}
  }

  async removeOrderDetails(orderDetailsId: number) {
    const models = initModels(sequelize);

    const existingOrderDetails = await models.OrderDetails.findOne({
      where: {
        order_details_id: orderDetailsId
      }
    });

    await models.OrderGoods.destroy({
      where: {
        order_details_id: orderDetailsId
      }
    })

    await existingOrderDetails.destroy();

    return {code: 200, message: 'Detaliile comenzii au fost sterse'}
  }

  async removeOrderGoods(orderGoodsId: any) {
    const models = initModels(sequelize);

    await models.OrderGoods.destroy({
      where: {
        order_goods_id: orderGoodsId
      }
    });

    return {code: 200, message: 'Produsul a fost sters'}
  }

  async addOrder(orderToAdd: any, decodedJwt: any = undefined) {
    const models = initModels(sequelize);

    const userPartner = (await models.Partner.findOne({
      where: {
        user_id: decodedJwt._id
      }
    })).partner_id;

    const invoiceData: any = {
      client_id: userPartner,
      buyer_id: orderToAdd.buyer_id,
      transporter_id: orderToAdd.transporter_id,
      created_at_utc: orderToAdd.created_at_utc,
      currency: orderToAdd.currency,
      number: orderToAdd.number,
      series: orderToAdd.series,
      transporter_price: parseFloat(Number(orderToAdd.transport_price).toFixed(2)),
      total_price: parseFloat(Number(orderToAdd.price).toFixed(2)),
      total_price_incl_vat: 0,
      driver_info: orderToAdd.driver_info,
      car_reg_number: orderToAdd.car_reg_no,
      status: 'unpaid',
      sent_status: 'not sent',
      type: 'order',
    }

    if (orderToAdd.currency === 'RON') {
      invoiceData.total_price_incl_vat = parseFloat((Number(invoiceData.total_price) + (Number(invoiceData.total_price) * 19.0 / 100.0)).toFixed(2))
    }

    if (orderToAdd.currency === 'EUR') {
      invoiceData.total_price_incl_vat = invoiceData.total_price
    }

    let createdInvoice: Invoice;

    try {
      createdInvoice = await this.createInvoice(invoiceData, models);
    } catch (err) {
      console.error(err);
      throw err;
    }

    const orders = orderToAdd.orderDetails?.map((orderDetailsItem: any) => {
      return {
        invoice_id: createdInvoice.invoice_id,
        drop_off_address: orderDetailsItem.drop_off_address,
        drop_off_date: orderDetailsItem.drop_off_date,
        pick_up_date: orderDetailsItem.pick_up_date,
        pick_up_address: orderDetailsItem.pick_up_address,
        products: orderDetailsItem.products,
        remarks: orderDetailsItem.remarks
      }
    });

    try {
      await Promise.all(orders.map(async (order: any) => {
        const createdOrder = await models.OrderDetails.create(order);

        const products = order.products.map((orderProduct: any) => {

          orderProduct.order_details_id = createdOrder.order_details_id;
          orderProduct.quantity = parseFloat(Number(orderProduct.quantity).toFixed(2));
          orderProduct.weight = parseFloat(Number(orderProduct.weight).toFixed(2));

          return orderProduct
        });

        await models.OrderGoods.bulkCreate(products);
      }));
    } catch (err) {
      console.error(err);
      throw err;
    }

    return {code: 201, message: 'Comanda a fost creata cu succes.'};
  }

  async addOrderDetails(orderDetails: any) {
    const models = initModels(sequelize);

    try {
      const createdOrder = await models.OrderDetails.create(orderDetails);

      const products = orderDetails.products.map((orderProduct: any) => {

        orderProduct.order_details_id = createdOrder.order_details_id;
        orderProduct.quantity = parseFloat(Number(orderProduct.quantity).toFixed(2));
        orderProduct.weight = parseFloat(Number(orderProduct.weight).toFixed(2));

        return orderProduct
      });

      await models.OrderGoods.bulkCreate(products);
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async getOrder(orderId: number) {
    const models = initModels(sequelize);

    return await models.Invoice.findOne({
      where: {
        invoice_id: orderId,
        type: 'order'
      },
      include: [
        {
          model: Partner, as: 'buyer',
          include: [{model: Contact, as :'Contacts'}]
        },
        {
          model: Partner, as: 'client'
        },
        {
          model: Partner, as: 'transporter'
        },
        {
          model: OrderDetails, as: 'OrderDetails',
          include: [{model: OrderGoods, as: 'OrderGoods'}]
        },
      ]
    })
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

      existingInvoice.transporter_price = invoiceUpdate.transporter_price;
      existingInvoice.transporter_id = invoiceUpdate.transporter_id;
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
      console.error(err);
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
