import express from "express";
import OrderService from "../services/order.service";
import InvoiceService from "../services/invoice.service";
import {CustomRequest} from "./auth.middleware";
import UserPartnerMappingService from "../services/user-partner-mapping.service";
import {UserPartnerMap} from "../db/models/init-models";
import UserService from "../services/user.service";

class OrderMiddleware {
  validateOrderCreationDate = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    if (!req.body?.created_at_utc) {
      return res.status(400).send({
        errorCode: 400,
        message: "Campul data emitere este obligatoriu"
      });
    }

    const latestOrder = await OrderService.getLatestOrderBySeries(req.body.series, req.body.client_id);

    if (!latestOrder) {
      return next();
    }

    if (new Date(latestOrder.created_at_utc).setHours(0, 0, 0, 0) > new Date(req.body.created_at_utc).setHours(0, 0, 0, 0)) {
      return res.status(400).send({
        errorCode: 400,
        message: `Exista o comanda mai noua in sistem. Va rugam sa alegeti o data ulterioara de ${new Date(latestOrder.created_at_utc).toUTCString()}`
      });
    }

    next();
  }

  validateOrderDoesNotExist = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {

    const invoiceDate = new Date(req.body.created_at_utc).setHours(0, 0, 0, 0);

    const condition = {
      created_at_utc: invoiceDate,
      series: req.body.series,
      number: req.body.number,
    }

    try {
      const existingOrder = await InvoiceService.findInvoice(condition);

      if (existingOrder) {
        return res.status(400).send({error: 400, message: "Comanda exista in sistem."})
      }

      next();
    } catch (err) {
      return res.status(500).send({errorCode: 500, message: err})
    }
  }

  validateUserPartner = async (
    req: CustomRequest,
    res: express.Response,
    next: express.NextFunction
  ) => {
    if (!req.body.client_id) {
      return res.status(400).send({code: 400, message: 'Firma este obligatorie'});
    }

    const userPartners = await UserPartnerMappingService.getUserPartnerMappings(Number((req.token as any)._id));

    const isPartnerValid = userPartners.some((userPartner: UserPartnerMap) => userPartner.partner_id === Number(req.body.client_id));

    if (!isPartnerValid) {
      return res.status(400).send({code: 400, message: 'Utilizatorul nu apartine firmei selectate'})
    }

    next();
  }

  validateOrderMinRequirements = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    if (!req.body.order_details) {
      return res.status(400).send({code: 400, message: 'Detaliile comenzii sunt obligatorii'})
    }

    if (!(req.body.order_details.some((elem: any) => elem.type === 'PICKUP') && req.body.order_details.some((elem: any) => elem.type === 'DROPOFF'))) {
      return res.status(400).send({
        code: 400,
        message: 'Sunt obligatorii cel putin o locatie ridicare si o locatie livrare'
      })
    }

    next();
  }

  validateUserOrder = async (
    req: CustomRequest,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const orderId = Number(req.params?.id || req.body?.order_id);

    const existingOrder = await OrderService.getOrder(orderId);

    if (!existingOrder) {
      return res.status(404).send({code: 404, message: 'Comanda nu a fost gasita'});
    }

    if (Number(existingOrder.user_id) !== Number((req.token as any)._id)) {
      const user = await UserService.getUser(existingOrder.user_id);

      return res.status(400).send({
        code: 400,
        message: `Operatiunea nu poate fi finalizata. Comanda apartine utilizatorului ${user.first_name} ${user.last_name}.`
      });
    }

    next();
  }
}

export default new OrderMiddleware();