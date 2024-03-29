import express from "express";
import InvoiceService from "../services/invoice.service";
import { CustomRequest } from "../middleware/auth.middleware";

class InvoiceController {
  async getInvoices(req: CustomRequest, res: express.Response) {
    const invoices = Object.keys(req.query).length
      ? await InvoiceService.getFilteredInvoices(req.query, req.token)
      : await InvoiceService.getInvoices(req.token);

    res.status(200).send(invoices);
  }

  async getInvoice(req: express.Request, res: express.Response) {
    const invoice_id = req.params?.id;

    res.status(200).send(await InvoiceService.findInvoice({ invoice_id: invoice_id }));
  }

  async getInvoiceWithDetails(req: express.Request, res: express.Response) {
    const invoiceId = Number(req.params?.id);

    const pdfInformation = await InvoiceService.getInvoiceWithDetails(invoiceId);

    res.status(200).send(pdfInformation);
  }

  async addInvoice(req: CustomRequest, res: express.Response) {
    const addedInvoice = await InvoiceService.addInvoice(req.body, req.token);

    res.status(201).send({ created: addedInvoice, msg: "Invoice created" });
  }

  async addNotice(req: CustomRequest, res: express.Response) {
    const response = await InvoiceService.createNotice(req.body, req.token);

    res.status(response?.code).send(response);
  }

  async findNextNumberForSeries(req: express.Request, res: express.Response) {
    const nextNumberForSeries = await InvoiceService.findNextSeriesNumber(req.body?.series, req.body?.type);

    res.status(200).send({ number: nextNumberForSeries });
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

    if (result.code === 500) {
      res.status(500).send(result);
    } else {
      res.status(202).send(result);
    }
  }

  async sendInvoice(req: express.Request, res: express.Response) {
    const result = await InvoiceService.sendInvoice(
      req.params?.id,
      req.body?.classifiedTaxCategory,
      req.body?.taxPercent
    );

    res.send(result).status(201);
  }

  async sendEtransport(req: express.Request, res: express.Response) {
    const result = await InvoiceService.sendEtransport(
      req.params?.id,
      req.body?.codScopOperatiune
    );

    res.status(result.code).send(result);
  }
}

export default new InvoiceController();