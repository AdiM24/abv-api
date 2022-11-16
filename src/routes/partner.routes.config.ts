import { CommonRoutesConfig } from "../common/common.routes.config";
import express from "express";
import PartnerController from "../controllers/partner.controller";

export class PartnerRoutes extends CommonRoutesConfig {
  constructor(app: express.Application) {
    super(app, "PartnerRoutes");
  }

  configureRoutes(): express.Application {
    this.app.route("/partners").post(PartnerController.addPartner);

    return this.app;
  }
}
