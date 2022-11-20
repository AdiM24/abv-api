import { CommonRoutesConfig } from "../common/common.routes.config";
import express from "express";
import PartnerController from "../controllers/partner.controller";
import AuthMiddleware from "../middleware/auth.middleware";

export class PartnerRoutes extends CommonRoutesConfig {
  constructor(app: express.Application) {
    super(app, "PartnerRoutes");
  }

  configureRoutes(): express.Application {
    this.app
      .route("/partners")
      .post( PartnerController.addPartner)
      .get(PartnerController.getPartners);

    this.app
      .route("/partners/:id")
      .get(AuthMiddleware.auth, PartnerController.getPartner);

    return this.app;
  }
}
