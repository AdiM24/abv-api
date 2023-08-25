import express from "express";
import InvoiceService from "../services/invoice.service";
import {CustomRequest} from "./auth.middleware";
import UserPartnerMappingService from "../services/user-partner-mapping.service";
import {UserPartnerMap} from "../db/models/init-models";

class InvoiceMiddleware {
  validateIssuedInvoiceCreationDate = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    if (req.body?.type !== 'issued') {
      return next();
    }

    if (!req.body?.created_at_utc) {
      return res.status(400).send({
        errorCode: 400,
        message: "Creation date is required"
      });
    }

    const invoiceSeries = req.body?.series;

    const latestInvoice = await InvoiceService.getLatestInvoiceBySeries(invoiceSeries);

    if (!latestInvoice) {
      return next();
    }

    if (new Date(latestInvoice.created_at_utc).setHours(0, 0, 0, 0) > new Date(req.body.created_at_utc).setHours(0, 0, 0, 0)) {
      return res.status(400).send({
        errorCode: 400,
        message: `There is already a newer invoice in the system. Please pick a later date than ${new Date(latestInvoice.created_at_utc).toUTCString()}`
      });
    }

    next();
  }

  validateDeadlineLaterThanCreationDate = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {

    if (!req.body.deadline_at_utc) {
      return next();
    }

    const createdAt = new Date(req.body.created_at_utc).getTime();
    const deadlineAt = new Date(req.body.deadline_at_utc).getTime();

    if (deadlineAt < createdAt) {
      return res.status(400).send({
        errorCode: 400,
        message: "Creation date cannot be greater than deadline date!"
      })
    }

    next();
  };

  validateInvoiceDoesNotExist = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    if (req.body?.type === 'notice') {
      return next();
    }

    const invoice = req.body;

    const invoiceDate = new Date(invoice.created_at_utc).setHours(0, 0, 0, 0)

    const condition = {
      created_at_utc: invoiceDate,
      series: invoice.series,
      number: invoice.number,
      type: invoice.type
    }

    try {
      const existingInvoice = await InvoiceService.findInvoice(condition);

      if (existingInvoice) {
        return res.status(400).send({error: 400, message: "Factura exista in sistem."})
      }

      next();
    } catch (err) {
      return res.status(500).send({errorCode: 500, message: err})
    }
  }

  validateExistingInvoiceProduct = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const invoiceProductData = req.body;

    const invoiceProductExists: boolean = await InvoiceService.checkInvoiceProductExists(invoiceProductData.invoice_id, invoiceProductData.product_id);

    if (!invoiceProductExists) {
      return res.status(404).send({error: 404, message: "Requested invoice product does not exist!"})
    }

    next();
  }

  validateExistingInvoice = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const invoiceExists = !!(await InvoiceService.findInvoice({invoice_id: req.body.invoice_id}))

    if (!invoiceExists) {
      return res.status(404).send({error: 404, message: "Invoice not found"})
    }

    next();
  }

  validateUserPartner = async (
    req: CustomRequest,
    res: express.Response,
    next: express.NextFunction
  ) => {

    if (req.body.type === 'notice') {
      return next();
    }

    const userId = (req.token as any)?._id;
    const userPartnerMappings = await UserPartnerMappingService.getUserPartnerMappings(Number(userId));

    if (req.body.type === 'issued') {

      const existingUserPartner = userPartnerMappings.find((userPartner: UserPartnerMap) => Number(userPartner.partner_id) === Number(req.body.client_id));

      if (!existingUserPartner) {
        return res.status(404).send({code: 404, message: 'Firma nu este asociata acestui utilizator.'});
      }
    }

    if (req.body.type === 'received') {
      const existingUserPartner = userPartnerMappings.find((userPartner: UserPartnerMap) => Number(userPartner.partner_id) === Number(req.body.buyer_id));

      if (!existingUserPartner) {
        return res.status(404).send({code: 404, message: 'Firma nu este asociata acestui utilizator.'});
      }
    }

    next();
  }
}

export default new InvoiceMiddleware();