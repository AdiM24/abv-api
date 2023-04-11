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
      .route("/api/partners")
      .post(AuthMiddleware.auth, PartnerMiddleware.validatePartnerAlreadyExists, PartnerController.addPartner)
      .get(AuthMiddleware.auth, PartnerMiddleware.validateUser, PartnerController.getPartners)
      .put(AuthMiddleware.auth, PartnerMiddleware.validatePartnerUpdate, PartnerController.updatePartner);

    this.app
      .route("/api/partners/comments")
      .get(AuthMiddleware.auth, PartnerController.getPartnerComments)
      .post(AuthMiddleware.auth, PartnerMiddleware.validateUserPartner, PartnerController.addPartnerComment)
      .delete(AuthMiddleware.auth, PartnerMiddleware.validateUserPartner, PartnerMiddleware.validateUserPartnerComment, PartnerController.deletePartnerComment)
    this.app
      .route("/api/partners/address/autocomplete")
      .get(AuthMiddleware.auth, PartnerController.getAddressAutocompleteOptions)

    this.app
      .route("/api/partners/user/autocomplete")
      .get(AuthMiddleware.auth, PartnerMiddleware.validateQueryParams, PartnerController.getUserAutocompleteOptions)

    this.app
      .route("/api/partners/autocomplete")
      .get(
        AuthMiddleware.auth,
        PartnerController.getAutocompleteOptions
      )

    this.app.route("/api/partners/:id")
      .get(PartnerController.getPartner);

    this.app
      .route("/api/partners/address")
      .post(PartnerController.addPartnerAddress)
      .put(PartnerController.updatePartnerAddresses);

    this.app
      .route("/api/partners/bankaccounts")
      .post(PartnerController.addPartnerBankAccount)
      .put(PartnerController.updatePartnerBankAccounts);

    this.app
      .route("/api/partners/contacts")
      .put(
        PartnerController.updatePartnerContacts
      );

    return this.app;
  }
}
