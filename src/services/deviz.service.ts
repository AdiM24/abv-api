import { sequelize } from "../db/sequelize";
import { AutoFleet, DevizAttributes, Partner, initModels } from "../db/models/init-models";
import { IDeviz } from "../common/interfaces/deviz.interface";
import { Includeable, Op } from "sequelize";
import { getDateRangeQuery, getPretQuery } from "../common/utils/query-utils.service";
import devizObjectForFrontend from "../common/utils/deviz/devizObjectForFrontend";
import { calculatePercentage } from "./utils.service";

class DevizService {
  async getDeviz(devizId: string) {
    const models = initModels(sequelize);

    try {
      const deviz: IDeviz = await models.Deviz.findOne({
        where: {
          deviz_id: devizId
        },
        include: [
          { model: AutoFleet, as: 'AutoFleet', attributes: ['reg_no'] },
          { model: Partner, as: 'Partner', attributes: ['name'] }
        ]
      });

      if (!deviz) {
        return { code: 404, message: 'Devizul nu a fost gasit.' };
      }

      return { code: 200, message: await devizObjectForFrontend(deviz) };
    } catch (error) {
      return { code: 500, message: `${error}` };
    }
  }

  async getDevize() {
    const models = initModels(sequelize);

    try {
      const devize: IDeviz[] = await models.Deviz.findAll({
        include: [
          { model: AutoFleet, as: 'AutoFleet', attributes: ['reg_no'] },
          { model: Partner, as: 'Partner', attributes: ['name'] }
        ],
        order: [['deviz_id', 'ASC']]
      });

      let valfaraTvaRon = 0;
      let tvaRon = 0;
      let valfaraTvaEuro = 0;
      let tvaEuro = 0;

      devize.map(async item => {
        if (item.currency === 'RON') {
          valfaraTvaRon += Number(item.pret_fara_tva);
          tvaRon += Number(item.tva);
        } else if (item.currency === 'EUR') {
          valfaraTvaEuro += Number(item.pret_fara_tva);
          tvaEuro += Number(item.tva);
        }
        return await devizObjectForFrontend(item);
      });

      const totalRon = valfaraTvaRon + tvaRon;
      const totalEuro = valfaraTvaEuro + tvaEuro;

      return {
        code: 200, message: {
          devize,
          valfaraTvaRon,
          tvaRon,
          totalRon,
          valfaraTvaEuro,
          tvaEuro,
          totalEuro
        }
      };
    } catch (error) {
      return { code: 500, message: `${error}` };
    }
  }

  async getFilteredDevize(queryParams: any) {
    console.log(queryParams);

    const models = initModels(sequelize);

    try {
      const queryObject: any = {};

      if (queryParams.created_from || queryParams.created_to) {
        queryObject.date = getDateRangeQuery(queryParams.created_from, queryParams.created_to);
      }

      if (queryParams.denumire) {
        queryObject.denumire = { [Op.eq]: queryParams.denumire };
      }

      if (queryParams.pret_from || queryParams.pret_to) {
        queryObject.pret_fara_tva = getPretQuery(queryParams.pret_from, queryParams.pret_to);
      }

      if (queryParams.infos) {
        queryObject.infos = { [Op.iLike]: `%${queryParams.infos}%` };
      }

      let relations: Includeable | Includeable[];
      if (queryParams.id) {
        const filter = queryParams.id.split(':');
        if (filter[0] === 'auto_fleet_id') {
          relations = { model: AutoFleet, as: 'AutoFleet', where: { auto_fleet_id: filter[1] }, attributes: ['reg_no'] };
        } else if (filter[0] === 'partner_id') {
          relations = { model: Partner, as: 'Partner', where: { partner_id: filter[1] }, attributes: ['name'] };
        }
      } else {
        relations = [
          { model: AutoFleet, as: 'AutoFleet', attributes: ['reg_no'] },
          { model: Partner, as: 'Partner', attributes: ['name'] }
        ];
      }

      const filteredDevize: IDeviz[] = await models.Deviz.findAll({
        include: relations,
        where: {
          [Op.and]: {
            ...queryObject
          }
        },
        order: [['deviz_id', 'ASC']]
      });

      let valfaraTvaRon = 0;
      let tvaRon = 0;
      let valfaraTvaEuro = 0;
      let tvaEuro = 0;

      filteredDevize.map(async item => {
        if (item.currency === 'RON') {
          valfaraTvaRon += Number(item.pret_fara_tva);
          tvaRon += Number(item.tva);
        } else if (item.currency === 'EUR') {
          valfaraTvaEuro += Number(item.pret_fara_tva);
          tvaEuro += Number(item.tva);
        }
        return await devizObjectForFrontend(item);
      });

      const totalRon = valfaraTvaRon + tvaRon;
      const totalEuro = valfaraTvaEuro + tvaEuro;

      return {
        code: 200, message: {
          devize:filteredDevize,
          valfaraTvaRon,
          tvaRon,
          totalRon,
          valfaraTvaEuro,
          tvaEuro,
          totalEuro
        }
      };
    } catch (error) {
      return { code: 500, message: `${error}` };
    }
  }

  async createDeviz(newDeviz: IDeviz) {
    const models = initModels(sequelize);

    try {
      if (newDeviz?.auto_fleet_id) {
        const existingVehicle = await models.AutoFleet.findOne({
          where: {
            auto_fleet_id: newDeviz.auto_fleet_id
          },
          attributes: ['auto_fleet_id']
        });

        if (!existingVehicle) {
          return { code: 404, message: 'Vehiculul nu a fost gasit.' };
        }

        if (!newDeviz?.cota_tva) {
          newDeviz.cota_tva = 19;
        }

        newDeviz.tva = parseFloat((calculatePercentage(Number(newDeviz.pret_fara_tva), Number(newDeviz.cota_tva)) - newDeviz.pret_fara_tva).toFixed(2));

        await models.Deviz.create(newDeviz);

        return { code: 201, message: 'Deviz creat cu succes.' };
      } else if (newDeviz?.partner_id) {
        const existingPartner = await models.Partner.findOne({
          where: {
            partner_id: newDeviz.partner_id
          },
          attributes: ['partner_id']
        });

        if (!existingPartner) {
          return { code: 404, message: 'Firma nu a fost gasita.' };
        }

        if (!newDeviz?.cota_tva) {
          newDeviz.cota_tva = 19;
        }

        newDeviz.tva = parseFloat((calculatePercentage(Number(newDeviz.pret_fara_tva), Number(newDeviz.cota_tva)) - newDeviz.pret_fara_tva).toFixed(2));

        await models.Deviz.create(newDeviz);

        return { code: 201, message: 'Deviz creat cu succes.' };
      } else {
        return { code: 400, message: 'Selectati un vehicul sau o firma pentru deviz.' }
      }
    } catch (error) {
      return { code: 500, message: `${error}` };
    }
  }

  async updateDeviz(devizId: string, deviz: IDeviz) {
    const models = initModels(sequelize);

    try {
      const existingDeviz = await models.Deviz.findOne({
        where: {
          deviz_id: devizId
        }
      });

      if (!existingDeviz) {
        return { code: 404, message: 'Devizul nu a fost gasit.' };
      }

      Object.keys(deviz).map((key: string) => {
        if (key !== 'deviz_id') {
          existingDeviz.setDataValue(key as keyof DevizAttributes, deviz[key as keyof DevizAttributes]);
        }
      })

      existingDeviz.tva = parseFloat((calculatePercentage(Number(existingDeviz.pret_fara_tva), Number(existingDeviz.cota_tva)) - existingDeviz.pret_fara_tva).toFixed(2));

      await existingDeviz.save();

      return { code: 200, message: 'Deviz actualizat cu succes.' };
    } catch (error) {
      return { code: 500, message: `${error}` };
    }
  }

  async deleteDeviz(devizId: string) {
    const models = initModels(sequelize);

    try {
      const existingDeviz = await models.Deviz.findOne({
        where: {
          deviz_id: devizId
        }
      });

      if (!existingDeviz) {
        return { code: 404, message: 'Devizul nu a fost gasit.' };
      }

      await existingDeviz.destroy();

      return { code: 200, message: 'Deviz sters cu succes.' };
    } catch (error) {
      return { code: 500, message: `${error}` };
    }
  }
}

export default new DevizService();
