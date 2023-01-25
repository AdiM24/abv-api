import { CommonRoutesConfig } from "../common/common.routes.config";
import express from "express";
import PartnerController from "../controllers/partner.controller";
import AuthMiddleware from "../middleware/auth.middleware";
import PartnerMiddleware from "../middleware/partner.middleware";

export class PartnerRoutes extends CommonRoutesConfig {
  constructor(app: express.Application) {
    super(app, "PartnerRoutes");
  }

  configureRoutes(): express.Application {
    this.app
      .route("/partners")
      .post(PartnerMiddleware.validatePartnerAlreadyExists, PartnerController.addPartner)
      .get(PartnerController.getPartners);

    // this.app.route("/partners/:id").get(PartnerController.getPartner);

    this.app
      .route("/partners/autocomplete")
      .get(
        PartnerController.getAutocompleteOptions
      )

    this.app
      .route("/partners/address")
      .put(
        PartnerController.updatePartnerAddresses
      );

    this.app
      .route("/partners/bankaccounts")
      .put(
        PartnerController.updatePartnerBankAccounts
      );

    this.app
      .route("/partners/contacts")
      .put(
        PartnerController.updatePartnerContacts
      );

    return this.app;
  }
}
