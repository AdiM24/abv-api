import express from "express";
import PartnerService from "../services/partner.service";

class PartnerMiddleware {
  validatePartnerAlreadyExists = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
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
}

export default new PartnerMiddleware();
