import express, {NextFunction} from "express";
import EmployeeService from "../services/employee.service";
import {EmployeeAttributes} from "../db/models/Employee";
import { EmployeeAddDto } from "../dtos/employee.dto";

class EmployeeMiddleware {
  async validateEmployeeDoesNotExist(req: express.Request, res: express.Response, next: NextFunction) {
    if (!req.body) {
      return res.status(400).send({errorCode: 400, message: "Invalid payload!"})
    }

    const existingEmployee = await EmployeeService.findEmployee({
      social_security_number: (req.body as EmployeeAddDto).social_security_number
    });

    if (existingEmployee) {
      return res.status(400).send({errorCode: 400, message: "Employee already exists!"})
    }

    next();
  }

  validateDeadlineLaterThanCreationDate = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    if (!req.body?.ssn_start_date || !req.body.ssn_end_date) {
      return res.status(400).send({
        errorCode: 400,
        message: "ID start date and expiry date are required!"
      })
    }

    const createdAt = new Date(req.body.ssn_start_date).getTime();
    const deadlineAt = new Date(req.body.ssn_end_date).getTime();

    if (deadlineAt < createdAt) {
      return res.status(400).send({
        errorCode: 400,
        message: "Start date cannot be greater than expiry date!"
      })
    }

    next();
  };

  async validateExistingEmployee(req: express.Request, res: express.Response, next: NextFunction) {
    if (!req.body) {
      return res.status(400).send({errorCode: 400, message: "Invalid payload!"})
    }

    const existingEmployee = await EmployeeService.findEmployee({
      employee_id: (req.body as EmployeeAttributes).employee_id
    });

    if (!existingEmployee) {
      return res.status(404).send({errorCode: 404, message: "Employee does not exist!"})
    }

    next();
  }

  async validateSsnLength(req: express.Request, res: express.Response, next: NextFunction) {
    if (!req.body) {
      return res.status(400).send({
        errorCode: 400,
        message: "Invalid payload!"
      })
    }

    if ((req.body as EmployeeAddDto).social_security_number.length != 13) {
      return res.send({
        errorCode: 400,
        message: "Social security number should have a length of 13 characters"
      }).status(400);
    }

    next();
  }
}

export default new EmployeeMiddleware();