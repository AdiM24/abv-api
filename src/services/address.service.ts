import {Employee, initModels} from "../db/models/init-models";
import {sequelize} from "../db/sequelize";
import {Op} from "sequelize";
import {getLikeQuery} from "../common/utils/query-utils.service";

class AddressService {
  async getEmployeeAutocompleteOptions(searchKey: string) {
    const models = initModels(sequelize);

    let employees: Employee[];

    try {
      employees = await models.Employee.findAll({
        where: {
          [Op.or]: {
            first_name: getLikeQuery(searchKey),
            last_name: getLikeQuery(searchKey)
          }
        }
      });
    } catch (err) {
      console.error(err);
    }

    return employees.map((employee: Employee) => (
      {
        employee_id: employee.employee_id,
        first_name: employee.first_name,
        last_name: employee.last_name,
      }
    ))
  }
}

export default new AddressService();