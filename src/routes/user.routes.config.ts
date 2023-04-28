import {CommonRoutesConfig} from "../common/common.routes.config";
import express from "express";
import UsersController from "../controllers/user.controller";
import UserController from "../controllers/user.controller";
import UsersMiddleware from "../middleware/user.middleware";
import UserMiddleware from "../middleware/user.middleware";
import AuthMiddleware from "../middleware/auth.middleware";

export class UserRoutes extends CommonRoutesConfig {
  constructor(app: express.Application) {
    super(app, "UserRoutes");
  }

  configureRoutes(): express.Application {
    this.app
      .route("/api/users")
      .get(AuthMiddleware.auth, UsersController.getUsers)
      .post(
        UsersMiddleware.validateRequiredUserBodyFields,
        UsersMiddleware.validateSameEmailDoesntExist,
        UsersController.createUser
      );

    this.app.route("/api/users/bulk").post(UsersController.createUsers);

    this.app
      .route("/api/users/series")
      .get(AuthMiddleware.auth, UsersController.getUserSeries)
      .post(AuthMiddleware.auth, UsersController.createUserSeries)

    this.app
      .route("/api/users/series/change")
      .post(AuthMiddleware.auth, UsersController.changeDefaultSeries)

    this.app
      .route("/api/users/email")
      .get(AuthMiddleware.auth, UserController.getUserPartnerEmails)
      .post(AuthMiddleware.auth, UserMiddleware.validateClaimingUser, UserController.createUserPartnerEmail)
      .delete(AuthMiddleware.auth, UserMiddleware.validateUserPartnerEmail, UserController.removeUserPartnerEmail)
      .put(AuthMiddleware.auth, UserMiddleware.validateClaimingUser, UserController.updateUserPartnerEmail)

    this.app
      .route("/api/chp")
      .post(UserController.changePassword);

    this.app
      .route("/api/user/partner")
      .get(AuthMiddleware.auth, UserController.getUserPartner);
    return this.app;
  }
}
