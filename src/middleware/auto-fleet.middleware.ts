import {CustomRequest} from "./auth.middleware";
import express, {NextFunction} from "express";
import AutoFleetService from "../services/auto-fleet.service";
import {AutoFleet} from "../db/models/AutoFleet";
import {UserPartnerMap} from "../db/models/init-models";
import UserPartnerMappingService from "../services/user-partner-mapping.service";

class AutoFleetMiddleware {
  async validateExistingRegNo(req: express.Request, res: express.Response, next: NextFunction) {
    if (!req.body?.reg_no) {
      return res.status(400).send({
        code: 400,
        message: `Numarul de inmatriculare este obligatoriu`
      })
    }

    const existingVehicle = await AutoFleetService.getFilteredAutoFleet({reg_no: req.body.reg_no});

    if (existingVehicle) {
      return res.status(400).send({
        code: 400,
        message: `Masina cu numarul de inmatriculare ${existingVehicle.reg_no} exista deja in sistem.`
      })
    }

    next();
  }

  async validateExistingVin(req: express.Request, res: express.Response, next: NextFunction) {
    if (!req.body?.reg_no) {
      return res.status(400).send({
        code: 400,
        message: `Seria de sasiu este obligatorie`
      })
    }

    const existingVehicle = await AutoFleetService.getFilteredAutoFleet({vin: req.body.vin});

    if (existingVehicle) {
      return res.status(400).send({
        code: 400,
        message: `Masina cu seria de sasiu ${existingVehicle.vin} exista deja in sistem.`
      })
    }

    next();
  }

  async validateUniqueFields(req: express.Request, res: express.Response, next: NextFunction) {
    const existingVehicle = await AutoFleetService.getAutoFleet(req.body.auto_fleet_id);

    if (req.body.vin !== existingVehicle.vin) {
      const existingVin = await AutoFleetService.getFilteredAutoFleet({vin: req.body.vin});

      if (existingVin) {
        return res.status(400).send({
          code: 400,
          message: `Masina cu seria de sasiu ${existingVehicle.vin} exista deja in sistem.`
        })
      }
    }

    if (req.body.reg_no !== existingVehicle.reg_no) {
      const existingRegNo = await AutoFleetService.getFilteredAutoFleet({reg_no: req.body.reg_no});

      if (existingRegNo) {
        return res.status(400).send({
          code: 400,
          message: `Masina cu numarul de inmatriculare ${existingVehicle.reg_no} exista deja in sistem.`
        })
      }
    }

    next();
  }

  async validatePartnerAutoFleet(
    req: CustomRequest,
    res: express.Response,
    next: NextFunction
  ) {
    const userId = (req.token as any)._id;
    const userPartners = await UserPartnerMappingService.getUserPartnerMappings(Number(userId));

    let existingAutoFleet: AutoFleet;

    if (req.params?.id) {
      existingAutoFleet = await AutoFleetService.getAutoFleet(Number(req.params.id));
    }

    if (req.body.auto_fleet_id) {
      existingAutoFleet = await AutoFleetService.getAutoFleet(req.body.auto_fleet_id);
    }

    if (!existingAutoFleet) {
      return res.status(404).send({code: 404, message: 'Masina nu a fost gasita in sistem'});
    }

    if (!userPartners.some((userPartner: UserPartnerMap) => Number(userPartner.partner_id) === Number(existingAutoFleet.partner_id))) {
      return res.status(400).send({code: 400, message: 'Masina nu apartine uneia dintre firmele utilizatorului.'})
    }

    next();
  }
}

export default new AutoFleetMiddleware();