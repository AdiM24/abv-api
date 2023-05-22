import {CommonRoutesConfig} from "../common/common.routes.config";
import express from "express";
import AuthMiddleware from "../middleware/auth.middleware";
import OrderMiddleware from "../middleware/order.middleware";
import OrderController from "../controllers/order.controller";

export class OrderRoutes extends CommonRoutesConfig {
  constructor(app: express.Application) {
    super(app, "OrderRoutes");
  }

  configureRoutes(): express.Application {
    this.app.route('/api/orders')
      .get(AuthMiddleware.auth,
        OrderController.getOrders)
      .post(AuthMiddleware.auth,
        OrderMiddleware.validateOrderDoesNotExist,
        OrderMiddleware.validateOrderCreationDate,
        OrderMiddleware.validateUserPartner,
        OrderMiddleware.validateOrderMinRequirements,
        OrderController.addOrder)
      .put(AuthMiddleware.auth,
        OrderMiddleware.validateUserPartner,
        OrderMiddleware.validateUserOrder,
        OrderController.updateOrder)

    this.app.route('/api/orders/series')
      .post(AuthMiddleware.auth,
        OrderController.getNextSeriesNumber)

    this.app
      .route("/api/orders/:id")
      .get(
        AuthMiddleware.auth,
        OrderController.getOrder
      )
      .delete(AuthMiddleware.auth,
        OrderMiddleware.validateUserOrder,
        OrderController.removeOrder)

    this.app
      .route("/api/orders/details/:id")
      .post(AuthMiddleware.auth, OrderController.addOrderDetails)
      .put(AuthMiddleware.auth, OrderController.updateOrderDetails)
      .delete(AuthMiddleware.auth, OrderController.removeOrderDetails)

    this.app
      .route("/api/orders/clone")
      .post(AuthMiddleware.auth,
        OrderMiddleware.validateUserOrder,
        OrderController.cloneOrder
      )

    this.app
      .route("/api/orders/generate")
      .post(AuthMiddleware.auth,
        OrderMiddleware.validateGeneratedInvoice,
        OrderMiddleware.validateUserOrder,
        OrderController.generateInvoice)
    return this.app;
  }
}