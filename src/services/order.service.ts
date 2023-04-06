import {
  Contact,
  initModels,
  OrderAttributes,
  OrderCreationAttributes,
  OrderDetails,
  OrderDetailsCreationAttributes,
  Partner,
  UserPartnerMap
} from "../db/models/init-models";
import {sequelize} from "../db/sequelize";
import UserPartnerMappingService from "./user-partner-mapping.service";
import {Transaction} from "sequelize";

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

    if (orderToUpdate.client_currency === 'RON') orderToUpdate.client_price = this.applyTax(orderToUpdate.client_price);
    if (orderToUpdate.transporter_currency === 'RON') orderToUpdate.transporter_price = this.applyTax(orderToUpdate.transporter_price);

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
    } catch (err) {
      console.error(err);
    }

  }
}

export default new OrderService();