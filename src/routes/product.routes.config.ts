import { CommonRoutesConfig } from "../common/common.routes.config";
import express from "express";
import AuthMiddleware from "../middleware/auth.middleware";
import ProductController from "../controllers/product.controller";

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

    this.app
      .route("/products/autocomplete").get(ProductController.getAutocompleteOptions)
    // this.app.route("/products/:id").get(ProductController.getProduct);

    this.app
      .route("/products/quantity/reserve")
      .post(ProductController.reserveProductQuantity)

    this.app
      .route("/products/quantity/check")
      .post(ProductController.checkProductQuantity)

    return this.app;
  }
}
