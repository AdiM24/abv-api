import express from "express";
import { ResponseError } from "../common/models/common.types";
import partnerService from "../services/partner.service";
import PartnerService from "../services/partner.service";

class PartnerController {
  async addPartner(req: express.Request, res: express.Response) {
    const addedPartnerId = await PartnerService.addPartner(req.body);

    res.status(201).send({ created: addedPartnerId, msg: "Partner created" });
  }

  async getPartners(req: express.Request, res: express.Response) {
    var partners = Object.keys(req.query).length
      ? await PartnerService.getFilteredPartners(req.query)
      : await PartnerService.getPartners();

    res.status(200).send(partners);
  }

  async getPartner(req: express.Request, res: express.Response) {
    const partnerId = Number(req.params.id);

    if (!partnerId) {
      res.send({
        errorCode: 400,
        message: "Partner could not be found",
      } as ResponseError);
    }

    const partner = await partnerService.getPartner(partnerId)

    return res.status(200).send(partner);
  }
}

export default new PartnerController();
