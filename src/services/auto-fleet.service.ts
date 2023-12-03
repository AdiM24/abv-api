import { CreateAutoFleetDto } from "../dtos/auto-fleet.dto";
import { sequelize } from "../db/sequelize";
import { AutoFleet, AutoFleetAttributes, initModels, Partner, UserPartnerMap } from "../db/models/init-models";
import UserPartnerMappingService from "./user-partner-mapping.service";
import { getInQuery, getLikeQuery } from "../common/utils/query-utils.service";
import { Op } from "sequelize";

class AutoFleetService {
  async getAutoFleets(decodedJwt: any) {
    const models = initModels(sequelize);

    const userPartners = await UserPartnerMappingService.getUserPartnerMappings(Number(decodedJwt._id));

    const partnerFleet = await models.AutoFleet.findAll({
      where: {
        partner_id: userPartners.map((userPartner: UserPartnerMap) => userPartner.partner_id)
      }
    });

    return partnerFleet;
  }

  async getFilteredAutoFleets(queryParams: any, decodedJwt: any) {
    const models = initModels(sequelize);

    const userPartnerIds = (await UserPartnerMappingService.getUserPartnerMappings(Number(decodedJwt._id))).map(
      (userPartner: UserPartnerMap) => userPartner.partner_id);

    const queryObject = {} as any;

    queryObject.partner_id = getInQuery(userPartnerIds);

    if (queryParams.reg_no) {
      queryObject.reg_no = getLikeQuery(queryParams.reg_no);
    }

    if (queryParams.model) {
      queryObject.model = getLikeQuery(queryParams.model);
    }

    const partnerFleet = await models.AutoFleet.findAll({
      where: {
        [Op.and]: {
          ...queryObject
        }
      }
    });

    return partnerFleet;
  }

  async getAutoFleet(auto_fleet_id: number) {
    const models = initModels(sequelize);

    const autoFleet = await models.AutoFleet.findOne({
      where: {
        auto_fleet_id: auto_fleet_id
      },
      include: [{ model: Partner, as: "partner" }]
    });

    return autoFleet;
  }

  castAutoFleetDates(autoFleet: CreateAutoFleetDto | AutoFleetAttributes) {
    autoFleet.itp = autoFleet.itp || null;
    autoFleet.casco = autoFleet.casco || null;
    autoFleet.rca = autoFleet.rca || null;
    autoFleet.carbon_copy = autoFleet.carbon_copy || null;
    autoFleet.aviz_medical = autoFleet.aviz_medical || null;
    autoFleet.aviz_psihologic = autoFleet.aviz_psihologic || null;
    autoFleet.cmr_insurance = autoFleet.cmr_insurance || null;
    autoFleet.vignette_hu = autoFleet.vignette_hu || null;
    autoFleet.vignette_ro = autoFleet.vignette_ro || null;
    autoFleet.vignette_slo = autoFleet.vignette_slo || null;
    autoFleet.max_weight_in_tons = autoFleet.max_weight_in_tons || 0;

    return autoFleet;
  }

  async createAutoFleet(autoFleet: CreateAutoFleetDto) {
    const models = initModels(sequelize);

    this.castAutoFleetDates(autoFleet);

    let createdAutoFleet: AutoFleet;

    try {
      createdAutoFleet = await models.AutoFleet.create(autoFleet);
    } catch (err) {
      console.error(err);
    }

    return createdAutoFleet;
  }

  async removeAutoFleet(auto_fleet_id: number) {
    const models = initModels(sequelize);

    try {
      await models.AutoFleet.destroy({
        where: {
          auto_fleet_id: auto_fleet_id
        }
      });

      return { code: 200, message: `Masina a fost stearsa.` }
    } catch (err) {
      console.error(err);
    }
  }

  async updateAutoFleet(autoFleet: AutoFleetAttributes) {
    const models = initModels(sequelize);

    this.castAutoFleetDates(autoFleet);

    const existingAutoFleet = await models.AutoFleet.findOne({
      where: {
        auto_fleet_id: autoFleet.auto_fleet_id
      }
    });

    Object.keys(autoFleet).map((key: string) => {
      if (key !== 'auto_fleet_id') {
        existingAutoFleet.setDataValue(key as keyof AutoFleetAttributes, autoFleet[key as keyof AutoFleetAttributes]);
      }
    });

    try {
      await existingAutoFleet.save();

      return { code: 200, message: 'Masina a fost actualizata.' };
    } catch (err) {
      console.error(err);
    }
  }

  async getFilteredAutoFleet(filter: any) {
    const models = initModels(sequelize);

    const existingVehicle = await models.AutoFleet.findOne({
      where: filter
    });

    return existingVehicle;
  }

  async getAutoFleetOptions(token: any) {
    const models = initModels(sequelize);

    const userPartnerIds = (await models.UserPartnerMap.findAll({
      attributes: ['partner_id'],
      where: {
        user_id: token._id
      }
    })).map((userPartner) => userPartner.partner_id);

    const autoFleetOptions = await models.AutoFleet.findAll({
      attributes: ['reg_no', 'auto_fleet_id'],
      where: {
        partner_id: userPartnerIds
      }
    });

    return autoFleetOptions;
  }

  async autoFleetExpenses(auto_fleet_id: string) {
    const models = initModels(sequelize);
    try {
      const autoFleetDevize = await models.Deviz.findAll({
        where: {
          auto_fleet_id: auto_fleet_id
        },
        attributes: ['pret_fara_tva', 'tva']
      });

      const totalExpenses = autoFleetDevize.reduce((accumulator, currentValue) => accumulator + Number(currentValue.pret_fara_tva) + Number(currentValue.tva), 0);
      
      return { code: 200, message: totalExpenses };
    } catch (error) {
      return { code: 500, message: `${error}` };
    }
  }
}

export default new AutoFleetService();
