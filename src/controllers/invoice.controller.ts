import express from "express";
import InvoiceService from "../services/invoice.service";

class InvoiceController {
  async getInvoices(req: express.Request, res: express.Response) {
    const invoices = Object.keys(req.query).length
      ? await InvoiceService.getFilteredInvoices(req.query)
      : await InvoiceService.getInvoices();

    res.status(200).send(invoices);
  }

  async getInvoice(req: express.Request, res: express.Response) {
    console.log(req.params);
    const invoice_id = req.params?.id;

    res.status(200).send(await InvoiceService.findInvoice({invoice_id: invoice_id}));
  }

  async getInvoiceWithDetails(req: express.Request, res: express.Response) {
    const invoiceId = Number(req.params?.id);

    const pdfInformation = await InvoiceService.getInvoiceWithDetails(invoiceId);

    res.status(200).send(pdfInformation);
  }

  async addInvoice(req: express.Request, res: express.Response) {
    const addedInvoice = await InvoiceService.addInvoice(req.body);

    res.status(201).send({created: addedInvoice, msg: "Invoice created"});
  }

  async findNextNumberForSeries(req: express.Request, res: express.Response) {
    const nextNumberForSeries = await InvoiceService.findIssuedInvoiceNextSeriesNumber(req.body?.series);

    res.status(200).send({number: nextNumberForSeries});
  }

  async getPdfInvoiceInformation(req: express.Request, res: express.Response) {
    const invoiceId = Number(req.params?.id);

    const pdfInformation = await InvoiceService.getInvoiceWithDetails(invoiceId);

    res.status(200).send(pdfInformation);
  }
}

export default new InvoiceController();