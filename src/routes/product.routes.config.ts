import {CommonRoutesConfig} from "../common/common.routes.config";
import express from "express";
import ProductController from "../controllers/product.controller";
import ProductMiddleware from "../middleware/product.middleware";

export class ProductRoutes extends CommonRoutesConfig {
  constructor(app: express.Application) {
    super(app, "ProductRoutes");
  }

  configureRoutes(): express.Application {
    this.app
      .route("/products")
      .post(ProductController.addProduct)
      .get(ProductController.getProducts)
      .put(ProductController.updateProduct);


    this.app.route("/products/:id")
      .get(ProductController.getProduct);

    this.app
      .route("/products/quantity/reserve")
      .post(
        ProductMiddleware.validateProductExistsByName,
        ProductController.reserveProductQuantity
      )

    this.app
      .route("/products/quantity/check")
      .post(ProductController.checkProductQuantity)

    this.app
      .route("/products/quantity/add")
      .post(ProductController.addProductQuantity)

    return this.app;
  }
}
