import { sequelize } from "../db/sequelize";
import { initModels, TimesheetEntry } from "../db/models/init-models";

class TimesheetService {
  async getTimesheetEntries() {
    const models = initModels(sequelize);

    return await models.TimesheetEntry.findAll();
  }
  
  async addTimesheetEntries(timesheetEntryToAdd: TimesheetEntryAddDto[]) {
      const models = initModels(sequelize);

      return await models.TimesheetEntry.bulkCreate(timesheetEntryToAdd);
  }

  async getEmployeesTimesheet() {
    const models = initModels(sequelize);

    return await models.Employee.findAll({
      include: [{model: TimesheetEntry, as: "timesheetEntries"}]
    });
  }
}

export default new TimesheetService();