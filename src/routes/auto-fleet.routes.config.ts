import {CommonRoutesConfig} from "../common/common.routes.config";
import express from "express";
import AuthMiddleware from "../middleware/auth.middleware";
import PartnerMiddleware from "../middleware/partner.middleware";
import AutoFleetController from "../controllers/auto-fleet.controller";
import AutoFleetMiddleware from "../middleware/auto-fleet.middleware";

export class AutoFleetRoutes extends CommonRoutesConfig {
  constructor(app: express.Application) {
    super(app, "AutoFleetRoutes");
  }

  configureRoutes(): express.Application {

    this.app
      .route('/autofleet')
      .get(AuthMiddleware.auth, AutoFleetController.getAutoFleets)
      .post(
        AuthMiddleware.auth,
        AutoFleetMiddleware.validateExistingRegNo,
        AutoFleetMiddleware.validateExistingVin,
        PartnerMiddleware.validateUserPartner,
        AutoFleetController.createAutoFleet)
      .put(
        AuthMiddleware.auth,
        AutoFleetMiddleware.validateUniqueFields,
        AutoFleetMiddleware.validatePartnerAutoFleet,
        AutoFleetController.updateAutoFleet)

    this.app
      .route('/autofleet/:id')
      .get(AuthMiddleware.auth, AutoFleetMiddleware.validatePartnerAutoFleet, AutoFleetController.getAutoFleet)
      .delete(AuthMiddleware.auth, AutoFleetMiddleware.validatePartnerAutoFleet, AutoFleetController.deleteAutoFleet)

    return this.app;
  }
}