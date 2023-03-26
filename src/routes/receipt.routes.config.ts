import { CommonRoutesConfig } from "../common/common.routes.config";
import express from "express";
import RegisterService from "../services/register.service";
import RegisterController from "../controllers/register.controller";
import AuthMiddleware from "../middleware/auth.middleware";
import ReceiptController from "../controllers/receipt.controller";

export class ReceiptRoutes extends CommonRoutesConfig {
  constructor(app: express.Application) {
    super(app, "ReceiptRoutes");
  }

  configureRoutes(): express.Application {
    this.app
      .route("/receipt")
      .get(
        AuthMiddleware.auth,
        ReceiptController.getReceipts)
      .post(
        AuthMiddleware.auth,
        ReceiptController.addReceipt)
      .delete(
        AuthMiddleware.auth,
        ReceiptController.removeReceipt
      );

    this.app
      .route("/receipt/:id")
      .get(
        AuthMiddleware.auth,
        ReceiptController.getReceiptById
      );

    this.app
      .route("/receipt/series")
      .post(
        AuthMiddleware.auth,
        ReceiptController.findNextSeriesNumber);


    return this.app;
  }
}