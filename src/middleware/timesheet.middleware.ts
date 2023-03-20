import express, { NextFunction } from "express";
import { TimesheetEntryAttributes } from "../db/models/TimesheetEntry";
import EmployeeService from "../services/employee.service";

class TimesheetMiddleware {
  async validateExistingEmployee(req: express.Request, res: express.Response, next: NextFunction) {
    if (!req.body) {
      return res.status(400).send({errorCode: 400, message: "Invalid payload!"})
    }

    const existingEmployee = await EmployeeService.findEmployee({
      employee_id: (req.body as TimesheetEntryAttributes[]).map((timesheetEntry) => timesheetEntry.employee_id)
    });

    if (!existingEmployee) {
      return res.status(404).send({errorCode: 404, message: "Employee does not exist!"})
    }

    next();
  }

}

export default new TimesheetMiddleware();