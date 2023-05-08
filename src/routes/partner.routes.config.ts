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
      .post(AuthMiddleware.auth, PartnerController.addPartnerAddress)
      .put(AuthMiddleware.auth, PartnerMiddleware.validateExistingUserAddress, PartnerController.updatePartnerAddress)
      .delete(AuthMiddleware.auth, PartnerController.deletePartnerAddress);

    this.app
      .route("/api/partners/bankaccounts")
      .post(AuthMiddleware.auth, PartnerController.addPartnerBankAccount)
      .put(AuthMiddleware.auth, PartnerMiddleware.validateExistingBankAccount, PartnerController.updatePartnerBankAccounts)
      .delete(AuthMiddleware.auth, PartnerMiddleware.validateExistingBankAccount, PartnerController.deletePartnerBankAccount)

    this.app
      .route("/api/partners/contacts")
      .post(
        AuthMiddleware.auth,
        PartnerController.addPartnerContact
      )
      .put(
        AuthMiddleware.auth,
        PartnerController.updatePartnerContact
      )
      .delete(
        AuthMiddleware.auth,
        PartnerController.deletePartnerContact
      );

    return this.app;
  }
}
