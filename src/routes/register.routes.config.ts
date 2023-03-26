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
      .get(
        AuthMiddleware.auth,
        RegisterController.getBankRegisterById
      )
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
      .get(
        AuthMiddleware.auth,
        RegisterController.getCashRegisterById
      )
      .delete(
        AuthMiddleware.auth,
        RegisterController.removeCashRegister);

    this.app
      .route("/cashregister/op/:id")
      .get(
        AuthMiddleware.auth,
        RegisterController.getCashRegisterOperations);

    this.app
      .route("/bankregister/op/:id")
      .get(
        AuthMiddleware.auth,
        RegisterController.getBankRegisterOperations);


    return this.app;
  }
}