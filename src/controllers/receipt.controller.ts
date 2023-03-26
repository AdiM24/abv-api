import express from "express";
import RegisterService from "../services/register.service";
import { CustomRequest } from "../middleware/auth.middleware";
import ReceiptService from "../services/receipt.service";

class ReceiptController {
  async getReceipts(req: CustomRequest, res: express.Response) {
    const receipts = await ReceiptService.getReceipts(req.token);

    res.status(200).send(receipts);
  }

  async getReceiptById(req: express.Request, res: express.Response) {
    const receiptId = Number(req.params?.id);

    const receipt = await ReceiptService.getReceiptById(receiptId);

    res.status(200).send(receipt);
  }

  async addReceipt(req: express.Request, res: express.Response) {
    const createdReceipt = await ReceiptService.addReceipt(req.body);

    res.status(200).send(createdReceipt);
  }

  async findNextSeriesNumber(req: express.Request, res: express.Response) {
    const nextNumberForSeries = await  ReceiptService.findNextSeriesNumber(req.body?.series);

    res.status(200).send({ number: nextNumberForSeries });
  }

  async removeReceipt(req: express.Request, res: express.Response) {
    const response = await ReceiptService.removeReceipt(req.body);

    res.status(200).send(response);
  }
}

export default new ReceiptController();