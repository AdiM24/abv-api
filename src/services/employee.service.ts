import {EmployeeAttributes, initModels, Partner} from "../db/models/init-models";
import {sequelize} from "../db/sequelize";
import {WhereOptions} from "sequelize";

class EmployeeService {
  async addEmployee(employeeToAdd: EmployeeAddDto) {
    const models = initModels(sequelize);

    return await models.Employee.create(employeeToAdd);
  }

  async getEmployees() {
    const models = initModels(sequelize);

    return await models.Employee.findAll();
  }

  async getEmployee(employeeId: number) {
    const models = initModels(sequelize);

    return await models.Employee.findOne({
      where: {
        employee_id: employeeId
      },
      include: [{model: Partner, as: "partner"}]
    });
  }

  async updateEmployee(employee: any) {
    const models = initModels(sequelize);

    const existingEmployee = await models.Employee.findOne({
      where: {
        employee_id: employee.employee_id
      }
    });

    existingEmployee.first_name = employee.first_name;
    existingEmployee.last_name = employee.last_name;
    existingEmployee.partner_id = employee.partner;
    existingEmployee.address = employee.address;
    existingEmployee.town = employee.town;
    existingEmployee.nationality = employee.nationality;
    existingEmployee.social_security_number = employee.social_security_number;
    existingEmployee.ssn_provider = employee.ssn_provider;
    existingEmployee.ssn_start_date = employee.ssn_start_date;
    existingEmployee.ssn_end_date = employee.ssn_end_date;
    existingEmployee.ssn_series = employee.ssn_series;
    existingEmployee.ssn_number = employee.ssn_number;
    existingEmployee.phone = employee.phone;
    existingEmployee.address = employee.address;

    try {
      return await existingEmployee.save();
    } catch (err) {
      console.error(err);
    }
  }

  async findEmployee(condition: WhereOptions<EmployeeAttributes>) {
    const models = initModels(sequelize);

    return await models.Employee.findOne({
      where: condition
    })
  }
}

export default new EmployeeService();