import { CommonRoutesConfig } from "../common/common.routes.config";
import express from "express";
import UsersController from "../controllers/user.controller";
import UsersMiddleware from "../middleware/user.middleware";
import AuthMiddleware from "../middleware/auth.middleware";
import UserController from "../controllers/user.controller";
import UserMiddleware from "../middleware/user.middleware";

export class UserRoutes extends CommonRoutesConfig {
  constructor(app: express.Application) {
    super(app, "UserRoutes");
  }

  configureRoutes(): express.Application {
    this.app
      .route("/users")
      .get(AuthMiddleware.auth, UsersController.getUsers)
      .post(
        UsersMiddleware.validateRequiredUserBodyFields,
        UsersMiddleware.validateSameEmailDoesntExist,
        UsersController.createUser
      );

    this.app.route("/users/bulk").post(UsersController.createUsers);

    this.app
      .route("/users/series")
      .get(AuthMiddleware.auth, UsersController.getUserSeries)
      .post(AuthMiddleware.auth, UsersController.createUserSeries)

    this.app
      .route("/users/series/change")
      .post(AuthMiddleware.auth, UsersController.changeDefaultSeries)

    this.app
      .route("/users/email")
      .get(AuthMiddleware.auth, UserController.getUserPartnerEmails)
      .post(AuthMiddleware.auth, UserMiddleware.validateClaimingUser, UserController.createUserPartnerEmail)
      .delete(AuthMiddleware.auth, UserMiddleware.validateUserPartnerEmail, UserController.removeUserPartnerEmail)
      .put(AuthMiddleware.auth, UserMiddleware.validateClaimingUser, UserController.updateUserPartnerEmail)

    return this.app;
  }
}
