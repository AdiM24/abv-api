import {CustomRequest} from "./auth.middleware";
import express, {NextFunction} from "express";
import PartnerService from "../services/partner.service";
import AutoFleetService from "../services/auto-fleet.service";
import {AutoFleet} from "../db/models/AutoFleet";

class AutoFleetMiddleware {
  async validatePartnerAutoFleet(
    req: CustomRequest,
    res: express.Response,
    next: NextFunction
  ) {
    const userId = (req.token as any)._id;
    const userPartners = await PartnerService.getUserPartners(userId);

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

    if (!userPartners.some((userPartner) => userPartner.partner_id === existingAutoFleet.partner_id)) {
      return res.status(400).send({code: 400, message: 'Masina nu apartine uneia dintre firmele utilizatorului.'})
    }

    next();
  }
}

export default new AutoFleetMiddleware();