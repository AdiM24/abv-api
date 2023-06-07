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
      .route('/api/timesheet')
      .get(
        TimesheetController.getTimesheetEntries
      )
      .post(
        TimesheetController.addTimesheetEntries
      );

    this.app
      .route('/api/timesheet/employee/:id')
      .get(
        AuthMiddleware.auth,
        TimesheetController.getEmployeesTimesheet
      );
      
    this.app
      .route('/api/timesheet/employee')
      .post(
        AuthMiddleware.auth,
        TimesheetController.updateTimesheetEntries
      );
    
    this.app
      .route('/api/timesheet/address/:id')
      .get(
        AuthMiddleware.auth,
        TimesheetController.getTimesheetEntriesByAddress
      );

    return this.app;
  }
}