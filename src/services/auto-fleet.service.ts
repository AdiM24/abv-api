import {CreateAutoFleetDto} from "../dtos/auto-fleet.dto";
import {sequelize} from "../db/sequelize";
import {AutoFleet, AutoFleetAttributes, initModels, Partner} from "../db/models/init-models";
import PartnerService from "./partner.service";

class AutoFleetService {
  async getAutoFleets(decodedJwt: any) {
    const models = initModels(sequelize);

    const userPartners = await PartnerService.getUserPartners(decodedJwt._id);

    const partnerFleet = await models.AutoFleet.findAll({
      where: {
        partner_id: userPartners.map((userPartner: Partner) => userPartner.partner_id)
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
      include: [{model: Partner, as: "partner"}]
    });

    return autoFleet;
  }

  castAutoFleetDates(autoFleet: CreateAutoFleetDto | AutoFleetAttributes) {
    autoFleet.itp = autoFleet.itp || null;
    autoFleet.casco = autoFleet.casco || null;
    autoFleet.rca = autoFleet.rca || null;
    autoFleet.carbon_copy = autoFleet.carbon_copy || null;
    autoFleet.cmr_insurance = autoFleet.cmr_insurance || null;
    autoFleet.vignette_hu = autoFleet.vignette_hu || null;
    autoFleet.vignette_ro = autoFleet.vignette_ro || null;
    autoFleet.vignette_slo = autoFleet.vignette_slo || null;

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

      return {code: 200, message: `Masina a fost stearsa.`}
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

      return {code: 200, message: 'Masina a fost actualizata.'};
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
}

export default new AutoFleetService();