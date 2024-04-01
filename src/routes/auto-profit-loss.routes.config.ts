import { CommonRoutesConfig } from "../common/common.routes.config";
import express from "express";
import AuthMiddleware from "../middleware/auth.middleware";
import AutoProfitLossController from "../controllers/auto-profit-loss.controller";

export class AutoProfitLossRoutes extends CommonRoutesConfig {
  constructor(app: express.Application) {
    super(app, "AutoProfitLossRoutes");
  }

  configureRoutes(): express.Application {
    this.app
      .route('/api/auto-profit-loss')
      .get(AuthMiddleware.auth, AutoProfitLossController.getReport)
    this.app
        .route('/api/auto-profit-loss/pdf')
        .get(AuthMiddleware.auth, AutoProfitLossController.getReportPdf)
    return this.app;
  }
}