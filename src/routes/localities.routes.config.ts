import {CommonRoutesConfig} from "../common/common.routes.config";
import express from "express";
import AuthMiddleware from "../middleware/auth.middleware";
import LocalitiesController from "../controllers/localities.controller";

export class LocalitiesRoutes extends CommonRoutesConfig {
  constructor(app: express.Application) {
    super(app, "LocalitiesRoutes");
  }

  configureRoutes(): express.Application {
    this.app
      .route("/api/localities/counties")
      .get(AuthMiddleware.auth, LocalitiesController.getCounties)

    this.app
        .route("/api/localities/cities")
        .get(AuthMiddleware.auth, LocalitiesController.getCities)


    return this.app;
  }
}
