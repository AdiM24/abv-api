import { CommonRoutesConfig } from "../common/common.routes.config";
import express from "express";
import AuthMiddleware from "../middleware/auth.middleware";
import ReceiptController from "../controllers/receipt.controller";
import RegisterMiddleware from "../middleware/register.middleware";

export class ReceiptRoutes extends CommonRoutesConfig {
  constructor(app: express.Application) {
    super(app, "ReceiptRoutes");
  }

  configureRoutes(): express.Application {
    this.app
      .route("/api/receipt")
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
      .route("/api/receipt/:id")
      .get(
        AuthMiddleware.auth,
        ReceiptController.getReceiptById
      );

    this.app
      .route("/api/receipt/series")
      .post(
        AuthMiddleware.auth,
        ReceiptController.findNextSeriesNumber);

    this.app
      .route("/api/operation")
      .post(
        AuthMiddleware.auth,
        RegisterMiddleware.validateUserRegister,
        RegisterMiddleware.validateSufficientFunds,
        ReceiptController.addOperation
      );

    return this.app;
  }
}