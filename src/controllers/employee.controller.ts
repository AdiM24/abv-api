import express from "express";
import EmployeeService from "../services/employee.service";
import {EmployeeAttributes} from "../db/models/Employee";

class EmployeeController {
  async getEmployees(req: express.Request, res: express.Response) {
    res.send(await EmployeeService.getEmployees()).status(200);
  }

  async getEmployee(req: express.Request, res: express.Response) {
    res.send(await EmployeeService.getEmployee(Number(req.params.id))).status(200);
  }

  async addEmployee(req: express.Request, res: express.Response) {
    const employee = await EmployeeService.addEmployee(req.body as EmployeeAddDto);

    res.send(employee).status(201);
  }

  async updateEmployee(req: express.Request, res: express.Response) {
    const employee = await EmployeeService.updateEmployee(req.body as EmployeeAttributes);

    res.send(employee).status(200);
  }

  async getEmployeeAutocompleteOptions(req: express.Request, res: express.Response) {
    res.status(200).send(await EmployeeService.getEmployeeAutocompleteOptions(req.query?.searchKey.toString()))
  }
}

export default new EmployeeController();