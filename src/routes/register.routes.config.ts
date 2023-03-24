import { CommonRoutesConfig } from "../common/common.routes.config";
import express from "express";
import RegisterService from "../services/register.service";
import RegisterController from "../controllers/register.controller";
import AuthMiddleware from "../middleware/auth.middleware";

export class RegisterRoutes extends CommonRoutesConfig {
  constructor(app: express.Application) {
    super(app, "RegisterRoutes");
  }

  configureRoutes(): express.Application {
    this.app
      .route("/bankregister")
      .get(
        AuthMiddleware.auth,
        RegisterController.getBankRegisters)
      .post(
        AuthMiddleware.auth,
        RegisterController.addBankRegister);

    this.app
      .route("/bankregister/:id")
      .delete(
        AuthMiddleware.auth,
        RegisterController.removeBankRegister);

    this.app
      .route("/cashregister")
      .get(
        AuthMiddleware.auth,
        RegisterController.getCashRegisters)
      .post(
        AuthMiddleware.auth,
        RegisterController.addCashRegister);

    this.app
      .route("/cashregister/:id")
      .delete(
        AuthMiddleware.auth,
        RegisterController.removeCashRegister);

    return this.app;
  }
}