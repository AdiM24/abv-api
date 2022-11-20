import express from "express";
import PartnerService from "../services/partner.service";

class PartnerController {
  async addPartner(req: express.Request, res: express.Response) {
    const addedPartnerId = await PartnerService.addPartner(req.body);

    res.status(201).send({ created: addedPartnerId, msg: "Partner created" });
  }

  async getPartners(req: express.Request, res: express.Response) {
    const partners = await PartnerService.getPartners();

    res.status(200).send(partners);
  }

  async getPartner(req: express.Request, res: express.Response) {
    const partnerId = req.body.id;

    if (!partnerId) {
      res.send({ errorCode: 400, msg: "Partner could not be found" });
    }
  }
}

export default new PartnerController();
