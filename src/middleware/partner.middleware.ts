import express from "express";
import PartnerService from "../services/partner.service";
import { CustomRequest } from "./auth.middleware";
import { Partner } from "../db/models/Partner";

class PartnerMiddleware {
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

  validateUserPartner = async (req: CustomRequest, res: express.Response, next: express.NextFunction) => {
    const userId = (req.token as any)?._id;
    const userPartners = await PartnerService.getUserPartners(Number(userId));
    let existingUserPartner: Partner;

    console.log(req.query);

    if (req.body?.partner_id) {
      existingUserPartner = userPartners.find((userPartner: Partner) => userPartner.partner_id === req.body.partner_id);
    }

    if (req.query?.partner_id) {
      console.log(userPartners);
      existingUserPartner = userPartners.find(
        (userPartner: Partner) => Number(userPartner.partner_id) === Number(req.query.partner_id),
      );
    }

    if (!existingUserPartner) {
      return res.status(400).send({ code: 400, message: "Partner is not associated to this user." });
    }

    next();
  };
}

export default new PartnerMiddleware();
