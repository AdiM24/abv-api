import express from "express";
import PartnerService from "../services/partner.service";
import {CustomRequest} from "./auth.middleware";
import {Partner} from "../db/models/Partner";
import UserPartnerMappingService from "../services/user-partner-mapping.service";
import {UserPartnerMap} from "../db/models/init-models";

class PartnerMiddleware {
  validateQueryParams = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (!req.query?.searchKey) {
      return res.status(400).send({code: 400, message: 'Parametrii incompatibili'})
    }

    next();
  }

  validateUser = async (req: CustomRequest, res: express.Response, next: express.NextFunction) => {
    const requestingUser = Number(req.query?.user_id);

    if (!requestingUser) {
      return next();
    }

    const actualUser = (req.token as any)._id;

    if (Number(actualUser) !== requestingUser) {
      return res.status(400).send({code: 400, message: 'Utilizator invalid'});
    }

    next();
  };

  validatePartnerAlreadyExists = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const tin = req.body?.unique_identification_number;

    const partner = await PartnerService.getPartnerByTin(tin);

    if (partner) {
      return res.status(404).send({
        errorCode: 404,
        message: "Partner already exists",
      });
    }

    next();
  };

  validatePartnerUpdate = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const requiredFields = ['name', 'unique_identification_number', 'trade_register_registration_number', 'address', 'vat_payer', 'vat_split', 'vat_collection', 'partner_id'];

    if (!requiredFields.every((key: string) => Object.keys(req.body).includes(key))) {
      return res.status(400).send({code: 400, message: 'Unul sau mai multi parametrii sunt invalizi'});
    }

    const existingPartner = PartnerService.getPartner(req.body.partner_id);

    if (!existingPartner) {
      return res.status(404).send({error: 404, message: 'Partenerul nu a fost gasit in sistem'});
    }

    if(await PartnerService.getUniquePartner(req.body.partner_id, req.body.unique_identification_number)) {
      return res.status(400).send({error: 400, message: 'CUI-ul introdus nu este unic'});
    }

    next();
  }

  validateUserPartner = async (req: CustomRequest, res: express.Response, next: express.NextFunction) => {
    const userId = (req.token as any)?._id;
    const userPartners = await UserPartnerMappingService.getUserPartnerMappings(Number(userId));
    let existingUserPartner: UserPartnerMap;

    if (!req.body?.partner_id || !req.query?.partner_id) {
      return next();
    }

    if (req.body?.partner_id) {
      existingUserPartner = userPartners.find((userPartner: UserPartnerMap) => userPartner.partner_id === req.body.partner_id);
    }

    if (req.query?.partner_id) {
      existingUserPartner = userPartners.find(
        (userPartner: UserPartnerMap) => Number(userPartner.partner_id) === Number(req.query.partner_id),
      );
    }

    if (!existingUserPartner) {
      return res.status(400).send({code: 400, message: "Partner is not associated to this user."});
    }

    next();
  };
}

export default new PartnerMiddleware();
