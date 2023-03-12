import {CommonRoutesConfig} from "../common/common.routes.config";
import express from "express";
import EmployeeMiddleware from "../middleware/employee.middleware";
import EmployeeController from "../controllers/employee.controller";

export class EmployeeRoutes extends CommonRoutesConfig {
  constructor(app: express.Application) {
    super(app, "InvoiceRoutes");
  }

  configureRoutes(): express.Application {

    this.app
      .route('/employees')
      .get(EmployeeController.getEmployees)
      .post(
        EmployeeMiddleware.validateEmployeeDoesNotExist,
        EmployeeMiddleware.validateDeadlineLaterThanCreationDate,
        EmployeeMiddleware.validateSsnLength,
        EmployeeController.addEmployee
      )
      .put(
        EmployeeMiddleware.validateExistingEmployee,
        EmployeeMiddleware.validateDeadlineLaterThanCreationDate,
        EmployeeMiddleware.validateSsnLength,
        EmployeeController.updateEmployee
      )

    this.app.route('/employees/autocomplete')
      .get(EmployeeController.getEmployeeAutocompleteOptions)

    this.app
      .route('/employees/:id')
      .get(EmployeeController.getEmployee);



    return this.app;
  }
}
