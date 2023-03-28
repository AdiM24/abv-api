import {CommonRoutesConfig} from "../common/common.routes.config";
import express from "express";
import AuthMiddleware from "../middleware/auth.middleware";
import EmailController from "../controllers/email.controller";

export class EmailRoutes extends CommonRoutesConfig {
  constructor(app: express.Application) {
    super(app, "EmailRoutes");
  }

  configureRoutes(): express.Application {

    this.app.route('/email/send')
      .post(AuthMiddleware.auth, EmailController.sendEmail)

    return this.app;
  }

}