import {
  Contact,
  initModels, Invoice,
  InvoiceCreationAttributes,
  InvoiceProductCreationAttributes,
  OrderAttributes,
  OrderCreationAttributes,
  OrderDetails,
  OrderDetailsAttributes,
  OrderDetailsCreationAttributes,
  Partner,
  UserPartnerMap
} from "../db/models/init-models";
import {sequelize} from "../db/sequelize";
import UserPartnerMappingService from "./user-partner-mapping.service";
import {Op, Transaction} from "sequelize";
import InvoiceService from "./invoice.service";
import {calculatePercentage} from "./utils.service";
import {getDateRangeQuery, getLikeQuery, getStrictQuery} from "../common/utils/query-utils.service";
import {Roles} from "../common/enums/roles";
import {CreateOrderDetailsDto, CreateOrderDto, OrderDto} from "../dtos/order.dto";

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
      user_id: Number(decodedJwt._id),
      invoice_generated: false,
      profit_currency: 'RON'
    }

    orderData.client_price = parseFloat(Number(orderToAdd.client_price).toFixed(2));
    orderData.transporter_price = parseFloat(Number(orderToAdd.transporter_price).toFixed(2));

    if (orderData.transporter_currency !== orderData.client_currency) {
      const transporterPrice = orderData.transporter_currency === 'EUR'
        ? parseFloat((orderData.transporter_price * orderToAdd.rate).toFixed(2))
        : orderData.transporter_price;
      const clientPrice = orderData.client_currency === 'EUR'
        ? parseFloat((orderData.client_price * orderToAdd.rate).toFixed(2))
        : orderData.client_price;

      orderData.profit = parseFloat((clientPrice - transporterPrice).toFixed(2));
      orderData.profit_currency = 'RON';
    } else {
      orderData.profit = parseFloat((orderData.client_price - orderData.transporter_price).toFixed(2));
      orderData.profit_currency = orderData.client_currency
    }

    // if (orderToAdd.client_currency === 'RON') orderData.client_price = this.applyTax(orderData.client_price);
    // if (orderToAdd.transporter_currency === 'RON') orderData.transporter_price = this.applyTax(orderData.transporter_price);

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
          model: Partner, as: 'client',
          include: [{model: Contact, as: 'Contacts'}]
        },
        {
          model: Partner, as: 'transporter',
          include: [{model: Contact, as: 'Contacts'}]
        },
        {
          model: OrderDetails, as: 'OrderDetails'
        },
      ]
    })
  }

  async getOrders(decodedToken: any) {
    const models = initModels(sequelize);

    const queryObject: any = {}

    if (decodedToken.role !== Roles.Administrator) {
      queryObject.user_id = getStrictQuery(Number(decodedToken._id));
    }

    const orders = await models.Order.findAll({
      where: {
        ...queryObject
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
      ],
      order: [["created_at_utc", "DESC"], ["number", "DESC"]]
    });

    return orders;
  }

  async getFilteredOrders(queryParams: any, decodedToken: any) {
    const models = initModels(sequelize);

    const queryObject = {} as any;

    if (decodedToken.role !== Roles.Administrator) {
      queryObject.user_id = getStrictQuery(Number(decodedToken._id));
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
      ],
      order: [["created_at_utc", "DESC"], ["number", "DESC"]]
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

  async generateInvoice(order: OrderDto, decodedToken: any) {
    const models = initModels(sequelize);

    const pickup: string = order?.OrderDetails?.filter(
      (orderDetailsItem: OrderDetailsAttributes) => orderDetailsItem.type === 'PICKUP')[0]?.address;

    const dropOffList = order?.OrderDetails?.filter(
      (orderDetailsItem: OrderDetailsAttributes) => orderDetailsItem.type === 'DROPOFF');

    const dropoff = dropOffList[dropOffList.length - 1].address;

    let transportService = await models.Product.findOne({
      where: {
        type: 'service',
        product_name: `Servicii transport cf. comanda ${order.series}-${order.number}, ruta: ${pickup} -> ${dropoff}, auto: ${order.car_reg_number}, referinta: ${order?.OrderDetails?.[0]?.reference}`
      }
    });

    const defaultInvoiceSerie = (await models.UserInvoiceSeries.findOne({
      where: {invoice_type: 'issued', user_id: Number(decodedToken._id)}
    })).series;

    const nextNumber = await InvoiceService.findNextSeriesNumber(defaultInvoiceSerie, 'issued');

    const currentDate = new Date(Date.now());
    let deadlineDate = new Date(Date.now());

    const deadlineDays = (await models.Partner.findOne({
      where: {partner_id: order.buyer_id}
    })).invoice_deadline_days;

    if (deadlineDays) {
      deadlineDate.setDate(deadlineDate.getDate() + Number(deadlineDays));
    } else {
      deadlineDate = null;
    }

    try {
      await sequelize.transaction(async (transaction: Transaction) => {
        if (!transportService) {
          transportService = await models.Product.create({
            type: 'service',
            product_name: `Servicii transport cf. comanda ${order.series}-${order.number}, ruta: ${pickup} -> ${dropoff}, auto: ${order.car_reg_number}, referinta: ${order?.OrderDetails?.[0]?.reference}`,
            quantity: 1,
            created_at_utc: currentDate.toString(),
            modified_at_utc: currentDate.toString(),
            vat: order.client_vat,
            unit_of_measure: 'OP',
            purchase_price: 1,
            material: ''
          }, {transaction: transaction});
        } else {
          transportService.vat = order.client_vat;
          await transportService.save();
        }

        const price = parseFloat(Number(order.client_price).toFixed(2));
        const vat = parseFloat((calculatePercentage(Number(order.client_price), Number(order.client_vat)) - Number(order.client_price)).toFixed(2))

        const invoiceData: InvoiceCreationAttributes = {
          series: defaultInvoiceSerie,
          number: nextNumber,
          client_id: order.client_id,
          created_at_utc: currentDate.toString(),
          deadline_at_utc: deadlineDays ? deadlineDate.toString() : null,
          user_id: Number(decodedToken._id),
          sent_status: 'not sent',
          status: 'unpaid',
          currency: order.client_currency,
          total_price_incl_vat: price + Number(vat),
          total_price: price,
          total_vat: vat,
          type: 'issued',
          order_reference_id: order.order_id,
          total_paid_price: 0,
          buyer_id: order.buyer_id,
          e_transport_generated: false
        }

        const createdInvoice: Invoice = await models.Invoice.create(invoiceData, {transaction: transaction});

        const invoiceProduct: InvoiceProductCreationAttributes = {
          product_id: transportService.product_id,
          invoice_id: createdInvoice.invoice_id,
          quantity: 1,
          sold_at_utc: currentDate.toString(),
          selling_price: parseFloat(Number(order.client_price).toFixed(2))
        }

        await models.InvoiceProduct.create(invoiceProduct, {transaction: transaction});

        const existingOrder = await models.Order.findOne({
          where: {
            order_id: order.order_id
          }
        });

        existingOrder.invoice_generated = true;

        await existingOrder.save();
      });
    } catch (err) {
      console.error(err);
    }

  }
}

export default new OrderService();