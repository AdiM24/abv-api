import {CustomRequest} from "../middleware/auth.middleware";
import express from "express";
import OrderService from "../services/order.service";

class OrderController {
  async updateOrder(req: CustomRequest, res: express.Response) {
    await OrderService.updateOrder(req.body, req.token);

    res.status(200).send({code: 200, message: 'Comanda a fost actualizata'});
  }

  async addOrder(req: CustomRequest, res: express.Response) {
    const addedOrder = await OrderService.addOrder(req.body, req.token);

    res.status(201).send({created: addedOrder, message: "Comanda a fost adaugata cu success"})
  }

  async getNextSeriesNumber(req: CustomRequest, res: express.Response) {
    const nextSeriesNumber = await OrderService.findNextOrderSeriesNumber(req.body.series, req.body.client_id);

    return res.status(200).send({number: nextSeriesNumber});
  }

  async removeOrderDetails(req: CustomRequest, res: express.Response) {
    await OrderService.removeOrderDetails(Number(req.params?.id));

    res.status(200).send({code: 200, message: 'Detaliile comenzii au fost sterse'});
  }

  async updateOrderDetails(req: CustomRequest, res: express.Response) {
    const result = await OrderService.updateOrderDetails(req.body);

    res.status(200).send(result);
  }

  async addOrderDetails(req: CustomRequest, res: express.Response) {
    const result = await OrderService.addOrderDetails(req.body);

    res.status(200).send(result);
  }

  async getOrder(req: express.Request, res: express.Response) {
    const orderId = Number(req.params?.id);

    res.status(200).send(await OrderService.getOrder(orderId));
  }

  async getOrders(req: CustomRequest, res: express.Response) {
    const orders = Object.keys(req.query).length
      ? await OrderService.getFilteredOrders(req.query, req.token)
      : await OrderService.getOrders(req.token);

    res.status(200).send(orders);
  }

  async removeOrder(req: CustomRequest, res: express.Response) {
    const result = await OrderService.removeOrder(Number(req.params?.id));

    res.status(result.code).send(result);
  }

  async generateInvoice(req: CustomRequest, res: express.Response) {
    await OrderService.generateInvoice(req.body, req.token);

    res.status(200).send({code: 200, message: 'Factura a fost generata'});
  }

  async cloneOrder(req: CustomRequest, res: express.Response) {
    await OrderService.cloneOrder(req.body.order_id, req.token);

    res.status(200).send({code: 200, message: 'Comanda a fost clonata'});
  }
}

export default new OrderController();