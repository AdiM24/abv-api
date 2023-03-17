import express from "express";
import InvoiceService from "../services/invoice.service";
import {CustomRequest} from "../middleware/auth.middleware";

class InvoiceController {
  async getInvoices(req: express.Request, res: express.Response) {
    const invoices = Object.keys(req.query).length
      ? await InvoiceService.getFilteredInvoices(req.query)
      : await InvoiceService.getInvoices();

    res.status(200).send(invoices);
  }

  async getInvoice(req: express.Request, res: express.Response) {
    const invoice_id = req.params?.id;

    res.status(200).send(await InvoiceService.findInvoice({invoice_id: invoice_id}));
  }

  async getInvoiceWithDetails(req: express.Request, res: express.Response) {
    const invoiceId = Number(req.params?.id);

    const pdfInformation = await InvoiceService.getInvoiceWithDetails(invoiceId);

    res.status(200).send(pdfInformation);
  }

  async addInvoice(req: CustomRequest, res: express.Response) {
    const addedInvoice = await InvoiceService.addInvoice(req.body, req.token);

    res.status(201).send({created: addedInvoice, msg: "Invoice created"});
  }

  async findNextNumberForSeries(req: express.Request, res: express.Response) {
    const nextNumberForSeries = await InvoiceService.findNextSeriesNumber(req.body?.series, 'issued');

    res.status(200).send({number: nextNumberForSeries});
  }

  async updateInvoiceData(req: express.Request, res: express.Response) {
    const result = await InvoiceService.updateInvoice(req.body);

    res.send(result).status(200);
  }

  async addInvoiceProduct(req: express.Request, res: express.Response) {
    const result = await InvoiceService.addInvoiceProduct(req.body);

    res.send(result).status(200);
  }

  async updateInvoiceProduct(req: express.Request, res: express.Response) {
    const result = await InvoiceService.updateInvoiceProduct(req.body);

    res.send(result).status(200);
  }

  async removeInvoiceProduct(req: express.Request, res: express.Response) {
    const result = await InvoiceService.removeInvoiceProduct(req.body);

    res.send(result).status(200);
  }

  async removeInvoice(req: express.Request, res: express.Response) {
    const result = await InvoiceService.removeInvoice(Number(req.params?.id));

    res.send(result).status(202);
  }
}

export default new InvoiceController();