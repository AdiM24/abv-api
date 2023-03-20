import express from "express";

import AuthMiddleware from "../middleware/auth.middleware";
import TimesheetMiddleware from "../middleware/timesheet.middleware";
import TimesheetController from "../controllers/timesheet.controller";

import { CommonRoutesConfig } from "../common/common.routes.config";

export class TimesheetRoutes extends CommonRoutesConfig {
  constructor(app: express.Application) {
      super(app, "TimesheetRoutes");
  }

  configureRoutes(): express.Application {

    this.app
      .route('/timesheet')
      .get(
        TimesheetController.getTimesheetEntries
      )
      .post(
        TimesheetController.addTimesheetEntries
      );

    this.app
      .route('/timesheet/employee')
      .get(
        AuthMiddleware.auth,
        TimesheetController.getEmployeesTimesheet
      )
      .post(
        AuthMiddleware.auth,
        TimesheetController.updateTimesheetEntries
      );

    return this.app;
  }
}