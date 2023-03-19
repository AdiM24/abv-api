import express from "express";

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
        TimesheetMiddleware.validateExistingEmployee,
        TimesheetController.addTimesheetEntries
      );

    this.app
      .route('/timesheet/employee')
      .get(
        TimesheetController.getEmployeesTimesheet
      );

    return this.app;
  }
}