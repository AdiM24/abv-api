import {CommonRoutesConfig} from "../common/common.routes.config";
import express from "express";
import PartnerController from "../controllers/partner.controller";
import PartnerMiddleware from "../middleware/partner.middleware";
import AuthMiddleware from "../middleware/auth.middleware";

export class PartnerRoutes extends CommonRoutesConfig {
  constructor(app: express.Application) {
    super(app, "PartnerRoutes");
  }

  configureRoutes(): express.Application {
    this.app
      .route("/partners")
      .post(AuthMiddleware.auth, PartnerMiddleware.validatePartnerAlreadyExists, PartnerController.addPartner)
      .get(PartnerController.getPartners);

    this.app
      .route("/partners/address/autocomplete")
      .get(AuthMiddleware.auth, PartnerController.getAddressAutocompleteOptions)

    this.app
      .route("/partners/user/autocomplete")
      .get(AuthMiddleware.auth, PartnerController.getUserAutocompleteOptions)

    this.app
      .route("/partners/autocomplete")
      .get(PartnerController.getAutocompleteOptions)

    this.app.route("/partners/:id")
      .get(PartnerController.getPartner);

    this.app
      .route("/partners/address")
      .post(PartnerController.addPartnerAddress)
      .put(PartnerController.updatePartnerAddresses);

    this.app
      .route("/partners/bankaccounts")
      .post(PartnerController.addPartnerBankAccount)
      .put(PartnerController.updatePartnerBankAccounts);

    this.app
      .route("/partners/contacts")
      .put(
        PartnerController.updatePartnerContacts
      );

    return this.app;
  }
}
