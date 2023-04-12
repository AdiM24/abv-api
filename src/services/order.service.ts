import {
  Contact,
  initModels,
  InvoiceCreationAttributes,
  InvoiceProductCreationAttributes,
  OrderAttributes,
  OrderCreationAttributes,
  OrderDetails,
  OrderDetailsCreationAttributes,
  Partner,
  UserPartnerMap
} from "../db/models/init-models";
import {sequelize} from "../db/sequelize";
import UserPartnerMappingService from "./user-partner-mapping.service";
import {Op, Transaction} from "sequelize";
import InvoiceService from "./invoice.service";
import {reversePercentage} from "./utils.service";
import {getDateRangeQuery, getLikeQuery, getStrictQuery} from "../common/utils/query-utils.service";

class OrderService {
  applyTax(price: number) {
    return parseFloat((Number(price) + (Number(price) * 19.0 / 100.0)).toFixed(2));
  }

  async updateOrderDetails(orderData: any) {
    const models = initModels(sequelize);

    const existingOrderDetails = await models.OrderDetails.findOne({
      where: {
        order_details_id: orderData.order_details_id
      }
    });

    await existingOrderDetails.update(orderData);

    await existingOrderDetails.save();

    return {code: 200, message: 'Detaliile comenzii au fost actualizate'}
  }

  async removeOrderDetails(orderDetailsId: number) {
    const models = initModels(sequelize);

    await models.OrderDetails.destroy({where: {order_details_id: orderDetailsId}});
  }

  async addOrder(orderToAdd: CreateOrderDto, decodedJwt: any = undefined) {
    const models = initModels(sequelize);

    const userPartnerId = (await UserPartnerMappingService.getUserPartnerMappings(Number(decodedJwt._id))).map(
      (userPartner: UserPartnerMap) => userPartner.partner_id)[0];

    const orderDetailsToAdd: CreateOrderDetailsDto[] = orderToAdd.order_details;
    delete orderToAdd.order_details;

    const orderData: OrderCreationAttributes = {
      ...orderToAdd,
      client_id: userPartnerId,
      user_id: Number(decodedJwt._id)
    }

    if (orderToAdd.client_currency === 'RON') orderData.client_price = this.applyTax(orderData.client_price);
    if (orderToAdd.transporter_currency === 'RON') orderData.transporter_price = this.applyTax(orderData.transporter_price);

    try {
      await sequelize.transaction(async (transaction: Transaction) => {
        const createdOrder = await models.Order.create(orderData, {transaction: transaction});

        const orderDetails: OrderDetailsCreationAttributes[] = orderDetailsToAdd.map((orderDetailsItem: CreateOrderDetailsDto) => {
          return {
            ...orderDetailsItem,
            order_id: createdOrder.order_id
          }
        });

        await models.OrderDetails.bulkCreate(orderDetails, {transaction: transaction});
      });

      return {code: 201, message: 'Comanda a fost creata.'};
    } catch (err) {
      console.error(err);
    }
  }

  async getOrder(orderId: number) {
    const models = initModels(sequelize);

    return await models.Order.findOne({
      where: {
        order_id: orderId
      },
      include: [
        {
          model: Partner, as: 'buyer',
          include: [{model: Contact, as: 'Contacts'}]
        },
        {
          model: Partner, as: 'client'
        },
        {
          model: Partner, as: 'transporter'
        },
        {
          model: OrderDetails, as: 'OrderDetails'
        },
      ]
    })
  }

  async getOrders(decodedToken: any) {
    const models = initModels(sequelize);

    const orders = await models.Order.findAll({
      where: {
        user_id: Number(decodedToken._id)
      },
      include: [
        {
          model: Partner, as: 'buyer',
        },
        {
          model: Partner, as: 'client'
        },
        {
          model: Partner, as: 'transporter'
        },
        {
          model: OrderDetails, as: 'OrderDetails'
        }
      ]
    });

    return orders;
  }

  async getFilteredOrders(queryParams: any, decodedToken: any) {
    const models = initModels(sequelize);

    const queryObject = {} as any;

    queryObject.user_id = getStrictQuery(Number(decodedToken._id));

    if (queryParams.series) {
      queryObject.series = getLikeQuery(queryParams.series);
    }

    if (queryParams.number) {
      queryObject.number = getStrictQuery(queryParams.number);
    }

    if (queryParams.created_from || queryParams.created_to) {
      queryObject.created_at_utc = getDateRangeQuery(queryParams.created_from, queryParams.created_to);
    }

    const orders = await models.Order.findAll({
      where: {
        [Op.and]: {
          ...queryObject
        }
      },
      include: [
        {
          model: Partner, as: 'buyer',
        },
        {
          model: Partner, as: 'client'
        },
        {
          model: Partner, as: 'transporter'
        },
        {
          model: OrderDetails, as: 'OrderDetails'
        }
      ]
    });

    return orders;
  }

  async addOrderDetails(orderDetails: any) {
    const models = initModels(sequelize);

    try {
      const createdOrder = await models.OrderDetails.create(orderDetails);

      return {code: 201, message: 'Detaliile comenzii au fost adaugate'};
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async findNextOrderSeriesNumber(series: string, partnerId: number) {
    const models = initModels(sequelize);

    const latestInvoiceNumberForSeries = (await models.Order.findOne({
      where: {
        series: series.toUpperCase(),
        client_id: partnerId
      },
      order: [["number", "DESC"]]
    }))?.get('number');

    if (!latestInvoiceNumberForSeries) {
      return 1;
    }

    return Number(latestInvoiceNumberForSeries) + 1;
  }

  async getLatestOrderBySeries(invoiceSeries: string, partnerId: number) {
    const models = initModels(sequelize);

    const latestInvoicesFromSeries = await models.Order.findOne({
      where: {
        series: invoiceSeries,
        client_id: partnerId
      },
      order: [
        ['created_at_utc', 'DESC']
      ]
    });

    if (!latestInvoicesFromSeries) {
      return null
    }

    return latestInvoicesFromSeries;
  }

  async updateOrder(orderToUpdate: OrderAttributes, decodedToken: any) {
    const models = initModels(sequelize);

    const currentOrder = await models.Order.findOne({where: {order_id: orderToUpdate.order_id}})

    if (orderToUpdate.client_currency === 'RON' && orderToUpdate.client_price !== currentOrder.client_price) orderToUpdate.client_price = this.applyTax(orderToUpdate.client_price);
    if (orderToUpdate.transporter_currency === 'RON' && orderToUpdate.transporter_price !== currentOrder.transporter_price) orderToUpdate.transporter_price = this.applyTax(orderToUpdate.transporter_price);

    await models.Order.update(orderToUpdate, {where: {order_id: orderToUpdate.order_id}})

    return true;
  }

  async removeOrder(orderId: number) {
    const models = initModels(sequelize);

    try {
      await sequelize.transaction(async (transaction: Transaction) => {
        await models.OrderDetails.destroy({where: {order_id: orderId}, transaction: transaction});
        await models.Order.destroy({where: {order_id: orderId}, transaction: transaction});
      });

      return {code: 200, message: 'Comanda a fost stearsa'};
    } catch (err) {
      return {code: 500, message: 'Comanda nu poate fi stearsa'}
      console.error(err);
    }

  }

  async cloneOrder(orderId: number, decodedToken: any) {
    const models = initModels(sequelize);

    const existingOrder = await models.Order.findOne({
      where: {order_id: orderId},
      raw: true
    });

    const existingOrderDetails = await models.OrderDetails.findAll({
      where: {order_id: orderId},
      raw: true
    });

    const nextNumber = await this.findNextOrderSeriesNumber(existingOrder.series, existingOrder.client_id);

    delete existingOrder.order_id;
    existingOrder.number = nextNumber;

    try {
      await sequelize.transaction(async (transaction: Transaction) => {

        const createdOrder = await models.Order.create(existingOrder, {transaction: transaction});

        existingOrderDetails.forEach((orderDetails: OrderDetails) => {
          orderDetails.order_id = createdOrder.order_id;
          delete orderDetails.order_details_id;
        });

        await models.OrderDetails.bulkCreate(existingOrderDetails, {transaction: transaction});
      });
    } catch (err) {
      console.error(err);
    }
  }

  async generateInvoice(order: OrderAttributes, decodedToken: any) {
    const models = initModels(sequelize);

    let transportService = await models.Product.findOne({
      where: {
        type: 'service',
        product_name: 'Servicii transport'
      }
    });

    const defaultInvoiceSerie = (await models.UserInvoiceSeries.findOne({
      where: {invoice_type: 'issued', user_id: Number(decodedToken._id)}
    })).series;

    const nextNumber = await InvoiceService.findNextSeriesNumber(defaultInvoiceSerie, 'issued');

    const currentDate = new Date(Date.now());

    const deadlineDays = (await models.Partner.findOne({
      where: {partner_id: order.client_id}
    })).invoice_deadline_days;

    try {
      await sequelize.transaction(async (transaction: Transaction) => {
        if (!transportService) {
          transportService = await models.Product.create({
            type: 'service',
            product_name: 'Servicii transport',
            quantity: 1,
            created_at_utc: currentDate.toString(),
            modified_at_utc: currentDate.toString(),
            vat: 19,
            unit_of_measure: 'OP',
            purchase_price: 1,
            material: ''
          }, {transaction: transaction});
        }

        const invoiceData: InvoiceCreationAttributes = {
          series: defaultInvoiceSerie,
          number: nextNumber,
          client_id: order.client_id,
          created_at_utc: currentDate.toString(),
          deadline_at_utc: deadlineDays ? new Date(currentDate.setDate(currentDate.getDate() + deadlineDays)).toString() : null,
          user_id: Number(decodedToken._id),
          sent_status: 'not sent',
          status: 'unpaid',
          currency: order.client_currency,
          total_price_incl_vat: order.client_price,
          total_price: order.client_currency === 'EUR' ? order.client_price : reversePercentage(order.client_price, 19),
          total_vat: order.client_currency === 'EUR' ? 0 : parseFloat((order.client_price - reversePercentage(order.client_price, 19)).toFixed(2)),
          type: 'issued',
          order_reference_id: order.order_id,
          total_paid_price: 0,
          buyer_id: order.buyer_id
        }

        const createdInvoice = await models.Invoice.create(invoiceData, {transaction: transaction});

        const invoiceProduct: InvoiceProductCreationAttributes = {
          product_id: transportService.product_id,
          invoice_id: createdInvoice.invoice_id,
          quantity: 1,
          sold_at_utc: currentDate.toString(),
          selling_price: order.client_price
        }

        await models.InvoiceProduct.create(invoiceProduct, {transaction: transaction});
      });
    } catch (err) {
      console.error(err);
    }

  }
}

export default new OrderService();