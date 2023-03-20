import express from "express";
import { decode } from "jsonwebtoken";
import { CustomRequest } from "../middleware/auth.middleware";
import TimesheetService from "../services/timesheet.service";

class TimesheetController {
  async getTimesheetEntries(req: express.Request, res: express.Response) {
    res.send(await TimesheetService.getTimesheetEntries()).status(200);
  }

  async addTimesheetEntries(req: express.Request, res: express.Response) {
    const timesheetEntry = await TimesheetService.addTimesheetEntries(req.body as TimesheetEntryAddDto[]);

    res.send(timesheetEntry).status(201);
  }

  async getEmployeesTimesheet(req: CustomRequest, res: express.Response) {
    const employees = await TimesheetService.getEmployeesTimesheet(req.token);

    res.send(employees).status(201);
  }

  async updateTimesheetEntries(req: express.Request, res: express.Response) {
    const response = await TimesheetService.updateTimesheetEntries(req.body);

    res.send(response).status(201);
  }
}

export default new TimesheetController();