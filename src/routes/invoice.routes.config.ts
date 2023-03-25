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
      .route("/invoices/series")
      .post(InvoiceController.findNextNumberForSeries);

    this.app
      .route("/invoices/orders")
      .post(
        AuthMiddleware.auth,
        InvoiceMiddleware.validateIssuedInvoiceCreationDate,
        InvoiceMiddleware.validateInvoiceDoesNotExist,
        InvoiceController.addOrder
      );

    this.app
      .route("/invoices/orders/:id")
      .get(
        AuthMiddleware.auth,
        InvoiceController.getOrder
      )

    this.app
      .route("/invoices/orders/goods/:id")
      .delete(AuthMiddleware.auth, InvoiceController.removeOrderGoods)

    this.app
      .route("/invoices/orders/details/:id")
      .put(AuthMiddleware.auth, InvoiceController.updateOrderDetails)
      .delete(AuthMiddleware.auth, InvoiceController.removeOrderDetails)

    return this.app;
  }
}