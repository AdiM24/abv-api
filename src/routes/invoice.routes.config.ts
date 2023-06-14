import {CommonRoutesConfig} from "../common/common.routes.config";
import express from "express";
import InvoiceController from "../controllers/invoice.controller";
import InvoiceMiddleware from "../middleware/invoice.middleware";
import ProductMiddleware from "../middleware/product.middleware";
import AuthMiddleware from "../middleware/auth.middleware";
import InvoiceService from "../services/invoice.service";

export class InvoiceRoutes extends CommonRoutesConfig {
  constructor(app: express.Application) {
    super(app, "InvoiceRoutes");
  }

  configureRoutes(): express.Application {
    this.app
      .route("/api/invoices")
      .get(
        AuthMiddleware.auth,
        InvoiceController.getInvoices
      )
      .post(
        AuthMiddleware.auth,
        InvoiceMiddleware.validateUserPartner,
        InvoiceMiddleware.validateIssuedInvoiceCreationDate,
        InvoiceMiddleware.validateDeadlineLaterThanCreationDate,
        InvoiceMiddleware.validateInvoiceDoesNotExist,
        InvoiceController.addInvoice
      )
      .put(
        AuthMiddleware.auth,
        InvoiceMiddleware.validateIssuedInvoiceCreationDate,
        InvoiceController.updateInvoiceData
      )

    this.app
      .route("/api/invoices/notice")
      .post(AuthMiddleware.auth, InvoiceMiddleware.validateUserPartner, InvoiceController.addNotice)

    this.app
      .route("/api/invoices/:id")
      .get(AuthMiddleware.auth, InvoiceController.getInvoiceWithDetails)
      .delete(AuthMiddleware.auth, InvoiceController.removeInvoice)

    this.app
      .route("/api/invoices/:id/product/update")
      .post(AuthMiddleware.auth, InvoiceMiddleware.validateExistingInvoiceProduct, InvoiceController.updateInvoiceProduct)

    this.app
      .route("/api/invoices/:id/product/remove")
      .post(AuthMiddleware.auth, InvoiceMiddleware.validateExistingInvoiceProduct, InvoiceController.removeInvoiceProduct)

    this.app
      .route("/api/invoices/:id/product/add")
      .post(
        AuthMiddleware.auth,
        InvoiceMiddleware.validateExistingInvoice,
        ProductMiddleware.validateProductExists,
        InvoiceController.addInvoiceProduct)

    this.app
      .route("/api/invoices/series")
      .post(AuthMiddleware.auth, InvoiceController.findNextNumberForSeries);

    this.app
      .route("/api/notices/etransport")
      .get(AuthMiddleware.auth, InvoiceController.generateETransport)

    return this.app;
  }
}