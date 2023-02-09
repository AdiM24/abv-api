import express from "express";
import InvoiceService from "../services/invoice.service";

class InvoiceMiddleware {
  validateIssuedInvoiceCreationDate = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    if (req.body?.type !== 'issued') {
      next();
    }

    if (!req.body?.created_at_utc) {
      return res.status(400).send({
        errorCode: 400,
        message: "Creation date is required"
      });
    }

    if (new Date(req.body?.created_at_utc).getTime() < new Date().getTime() ) {
      return res.status(400).send({
        errorCode: 400,
        message: "Creation date cannot be in the past"
      });
    }

    next();
  }

  validateDeadlineLaterThanCreationDate = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    if (!req.body?.created_at_utc || !req.body.deadline_at_utc) {
      return res.status(400).send({
        errorCode: 400,
        message: "Creation date and deadline date are required!"
      })
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
    const invoice = req.body;

    const invoiceDate = new Date(invoice.created_at_utc).setHours(0, 0, 0, 0)

    const condition = {
      created_at_utc: invoiceDate,
      series: invoice.series,
      number: invoice.number
    }

    const existingInvoice = await InvoiceService.findInvoice(condition);

    if (existingInvoice) {
      return res.status(400).send({error: 400, message: "Invoice already exists"})
    }

    next();
  }
}

export default new InvoiceMiddleware();