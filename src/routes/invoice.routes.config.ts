import {CommonRoutesConfig} from "../common/common.routes.config";
import express from "express";
import InvoiceController from "../controllers/invoice.controller";
import InvoiceMiddleware from "../middleware/invoice.middleware";
import ProductMiddleware from "../middleware/product.middleware";
import AuthMiddleware from "../middleware/auth.middleware";

export class InvoiceRoutes extends CommonRoutesConfig {
  constructor(app: express.Application) {
    super(app, "InvoiceRoutes");
  }

  configureRoutes(): express.Application {
    this.app
      .route("/invoices")
      .get(InvoiceController.getInvoices)
      .post(
        AuthMiddleware.auth,
        InvoiceMiddleware.validateUserPartner,
        InvoiceMiddleware.validateIssuedInvoiceCreationDate,
        InvoiceMiddleware.validateDeadlineLaterThanCreationDate,
        InvoiceMiddleware.validateInvoiceDoesNotExist,
        InvoiceController.addInvoice
      )
      .put(
        InvoiceMiddleware.validateIssuedInvoiceCreationDate,
        InvoiceController.updateInvoiceData
      )

    this.app
      .route("/invoices/:id")
      .get(InvoiceController.getInvoiceWithDetails)
      .delete(InvoiceController.removeInvoice)

    this.app
      .route("/invoices/:id/product/update")
      .post(InvoiceMiddleware.validateExistingInvoiceProduct, InvoiceController.updateInvoiceProduct)

    this.app
      .route("/invoices/:id/product/remove")
      .post(InvoiceMiddleware.validateExistingInvoiceProduct, InvoiceController.removeInvoiceProduct)

    this.app
      .route("/invoices/:id/product/add")
      .post(
        InvoiceMiddleware.validateExistingInvoice,
        ProductMiddleware.validateProductExists,
        InvoiceController.addInvoiceProduct)

    this.app
      .route("/invoices/issued/number")
      .post(InvoiceController.findNextNumberForSeries)

    return this.app;
  }
}