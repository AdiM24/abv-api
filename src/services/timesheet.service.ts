import { sequelize } from "../db/sequelize";
import {Employee, initModels, Partner, TimesheetEntry, UserPartnerMap} from "../db/models/init-models";
import PartnerService from "./partner.service";
import { addOrUpdate } from "./utils.service";
import UserPartnerMappingService from "./user-partner-mapping.service";
import { TimesheetEntryAddDto } from "../dtos/timesheet.dto";

class TimesheetService {
  async getTimesheetEntries() {
    const models = initModels(sequelize);

    return await models.TimesheetEntry.findAll();
  }

  async getTimesheetEntriesByAddress(id:number){
    const models = initModels(sequelize);

    const model=  await models.TimesheetEntry.findAll({
      where:{
        address_id:id
      },
      include:[
        {
          model:Employee,
          as:"employee",
        },
      ]
    });


  }
  
  async addTimesheetEntries(timesheetEntriesToAdd: TimesheetEntryAddDto[]) {
    const models = initModels(sequelize);

    await Promise.all(timesheetEntriesToAdd.map(async (timesheetEntry) => {
      return await addOrUpdate<TimesheetEntryAddDto, TimesheetEntry>(
        timesheetEntry,
        {
          employee_id: timesheetEntry.employee_id,
          date: timesheetEntry.date,
          address_id:timesheetEntry.address_id
        },
        models.TimesheetEntry
      )
    }));

    return {
      code: 201,
      message: "Pontajul a fost actualizat"
    }
  }

  async getEmployeesTimesheet(decodedJwt: any,id:number) {
    const models = initModels(sequelize);

    const userPartners = await UserPartnerMappingService.getUserPartnerMappings(Number(decodedJwt._id));

    return await models.Employee.findAll({
      where: {
        partner_id: userPartners.map((userPartner: UserPartnerMap) => userPartner.partner_id)
      },
      include: [{model: TimesheetEntry, as: "TimesheetEntries", where:{
        address_id:id
      }}]
    });
  }

  async updateTimesheetEntries(timesheetEntries: TimesheetEntryAddDto[]) {
    const models = initModels(sequelize);

    await Promise.all(timesheetEntries.map(async (timesheetEntry) => {
      return await addOrUpdate<TimesheetEntryAddDto, TimesheetEntry>(
        timesheetEntry,
        {
          employee_id: timesheetEntry.employee_id,
          date: timesheetEntry.date,
          address_id:timesheetEntry.address_id
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