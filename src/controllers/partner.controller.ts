import express from "express";
import PartnerService from "../services/partner.service";

class PartnerController {
  async addPartner(req: express.Request, res: express.Response) {
    const addedPartnerStatus = await PartnerService.addPartner(req.body);

    res.send(addedPartnerStatus).status(201);
  }
}

export default new PartnerController();
