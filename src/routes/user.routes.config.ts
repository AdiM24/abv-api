import { CommonRoutesConfig } from "../common/common.routes.config";
import express from "express";
import UsersController from "../controllers/user.controller";
import UsersMiddleware from "../middleware/user.middleware";
import AuthMiddleware from "../middleware/auth.middleware";

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

    return this.app;
  }
}
