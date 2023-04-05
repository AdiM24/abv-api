import { sequelize } from "../db/sequelize";
import {initModels, Partner, TimesheetEntry, UserPartnerMap} from "../db/models/init-models";
import PartnerService from "./partner.service";
import { addOrUpdate } from "./utils.service";
import UserPartnerMappingService from "./user-partner-mapping.service";

class TimesheetService {
  async getTimesheetEntries() {
    const models = initModels(sequelize);

    return await models.TimesheetEntry.findAll();
  }
  
  async addTimesheetEntries(timesheetEntriesToAdd: TimesheetEntryAddDto[]) {
    const models = initModels(sequelize);

    await Promise.all(timesheetEntriesToAdd.map(async (timesheetEntry) => {
      return await addOrUpdate<TimesheetEntryAddDto, TimesheetEntry>(
        timesheetEntry,
        {
          employee_id: timesheetEntry.employee_id,
          date: timesheetEntry.date
        },
        models.TimesheetEntry
      )
    }));

    return {
      code: 201,
      message: "Pontajul a fost actualizat"
    }
  }

  async getEmployeesTimesheet(decodedJwt: any) {
    const models = initModels(sequelize);

    const userPartners = await UserPartnerMappingService.getUserPartnerMappings(Number(decodedJwt._id));

    return await models.Employee.findAll({
      where: {
        partner_id: userPartners.map((userPartner: UserPartnerMap) => userPartner.partner_id)
      },
      include: [{model: TimesheetEntry, as: "TimesheetEntries"}]
    });
  }

  async updateTimesheetEntries(timesheetEntries: TimesheetEntryAddDto[]) {
    const models = initModels(sequelize);

    await Promise.all(timesheetEntries.map(async (timesheetEntry) => {
      return await addOrUpdate<TimesheetEntryAddDto, TimesheetEntry>(
        timesheetEntry,
        {
          employee_id: timesheetEntry.employee_id,
          date: timesheetEntry.date
        },
        models.TimesheetEntry
      )
    }));

    return {
      code: 201,
      message: "Pontajul a fost actualizat"
    }
  }
}

export default new TimesheetService();