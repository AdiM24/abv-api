import { CommonRoutesConfig } from "../common/common.routes.config";
import express from "express";
import EmployeeMiddleware from "../middleware/employee.middleware";
import EmployeeController from "../controllers/employee.controller";
import AuthMiddleware from "../middleware/auth.middleware";
import PartnerMiddleware from "../middleware/partner.middleware";

export class EmployeeRoutes extends CommonRoutesConfig {
  constructor(app: express.Application) {
    super(app, "EmployeeRoutes");
  }

  configureRoutes(): express.Application {
    this.app
      .route("/api/employees")
      .get(
        AuthMiddleware.auth,
        PartnerMiddleware.validateUserPartner,
        EmployeeController.getEmployees
      )
      .post(
        EmployeeMiddleware.validateEmployeeDoesNotExist,
        EmployeeMiddleware.validateDeadlineLaterThanCreationDate,
        EmployeeMiddleware.validateSsnLength,
        EmployeeController.addEmployee,
      )
      .put(
        EmployeeMiddleware.validateExistingEmployee,
        EmployeeMiddleware.validateDeadlineLaterThanCreationDate,
        EmployeeMiddleware.validateSsnLength,
        EmployeeController.updateEmployee,
      );

    this.app.route("/api/employees/autocomplete").get(EmployeeController.getEmployeeAutocompleteOptions);

    this.app.route("/api/employees/:id").get(EmployeeController.getEmployee);

    return this.app;
  }
}
