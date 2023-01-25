import express from "express";
import InvoiceService from "../services/invoice.service";

class InvoiceController {
  async addInvoice(req: express.Request, res: express.Response) {
    const addedInvoice = await InvoiceService.addReceivedInvoice(req.body);

    if (addedInvoice?.error) {
      return res.status(400).send(addedInvoice);
    }

    res.status(201).send({created: addedInvoice, msg: "Invoice created"});
  }
}

export default new InvoiceController();