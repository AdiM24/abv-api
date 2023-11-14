import DevizMiddleware from "../middleware/deviz.middleware";
import { CommonRoutesConfig } from "../common/common.routes.config";
import express from "express";
import DevizController from "../controllers/deviz.controller";
import AuthMiddleware from "../middleware/auth.middleware";

export class DevizRoutes extends CommonRoutesConfig {
  constructor(app: express.Application) {
    super(app, "DevizRoutes");
  }

  configureRoutes(): express.Application {

    this.app
      .route('/api/deviz/:id')
      .get(AuthMiddleware.auth, DevizController.getDeviz)
      .delete(AuthMiddleware.auth, DevizController.deleteDeviz)
      .put(AuthMiddleware.auth, DevizMiddleware.validateDevizTypeForUpdate, DevizController.updateDeviz)

    this.app
      .route('/api/deviz')
      .get(AuthMiddleware.auth, DevizController.getDevize)
      .post(AuthMiddleware.auth, DevizMiddleware.validateDevizTypeForCreate, DevizController.createDeviz)

    return this.app;
  }
}