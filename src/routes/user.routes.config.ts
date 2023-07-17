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
        AuthMiddleware.auth,
        UsersMiddleware.validateRequiredUserBodyFields,
        UsersMiddleware.validateSameEmailDoesntExist,
        UsersController.createUser
      )
      .put(AuthMiddleware.auth, UsersController.updateUser);

    this.app.route("/api/users/bulk").post(UsersController.createUsers);

    this.app
      .route("/api/users/series")
      .get(AuthMiddleware.auth, UsersController.getUserSeries)
      .post(AuthMiddleware.auth, UsersController.createUserSeries)
      .delete(AuthMiddleware.auth, UserController.deleteUserSeries);

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
      .route("/api/users/password")
      .put(AuthMiddleware.auth, UserController.changePassword);

    this.app
      .route("/api/users/role")
      .post(AuthMiddleware.auth, UserController.addRole)
      .put(AuthMiddleware.auth, UserController.changeRole);

    this.app
      .route("/api/user/partner")
      .get(AuthMiddleware.auth, UserController.getUserPartner);

    this.app
      .route("/api/user/vehicle")
      .get(AuthMiddleware.auth, UserController.getUserVehicle)

    this.app
      .route("/api/users/current")
      .get(AuthMiddleware.auth, UsersController.getCurrentUser)
      .put(AuthMiddleware.auth, UsersController.updateCurrentUser);

    this.app.route("/api/users/:id")
      .get(AuthMiddleware.auth, UsersController.getUser)
      .delete(AuthMiddleware.auth, UserController.deleteUser)

    return this.app;
  }
}
