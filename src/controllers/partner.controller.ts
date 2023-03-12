import express from "express";
import {ResponseError} from "../common/models/common.types";
import partnerService from "../services/partner.service";
import PartnerService from "../services/partner.service";

class PartnerController {
  async addPartner(req: express.Request, res: express.Response) {
    const addedPartnerId = await PartnerService.addPartner(req.body);

    res.status(201).send({created: addedPartnerId, msg: "Partner created"});
  }

  async getAutocompleteOptions(req: express.Request, res: express.Response) {
    res.status(200).send(await PartnerService.getPartnerAutocompleteOptions(req.query?.searchKey.toString()));
  }

  async getAddressAutocompleteOptions(req: express.Request, res: express.Response) {
    res.status(200).send(await PartnerService.getPartnerAddressOptions(req.query?.searchKey.toString()));
  }

  async getPartners(req: express.Request, res: express.Response) {

    const partners = Object.keys(req.query).length
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

  async addPartnerBankAccount(req:express.Request, res: express.Response) {
    const result = await PartnerService.addPartnerBankAccount(req.body);

    return res.status(200).send(result);
  }

  async addPartnerAddress(req:express.Request, res: express.Response) {
    const result = await PartnerService.addPartnerAddress(req.body);

    return res.status(200).send(result);
  }

  async updatePartnerAddresses(req: express.Request, res: express.Response) {
    const result = await PartnerService.updatePartnerAddresses(req.body)

    return res.status(200).send(result);
  }

  async updatePartnerBankAccounts(req: express.Request, res: express.Response) {
    const result = await PartnerService.updatePartnerBankAccounts(req.body)

    return res.status(200).send(result);
  }

  async updatePartnerContacts(req: express.Request, res: express.Response) {
    const result = await PartnerService.updatePartnerContacts(req.body)

    return res.status(200).send(result);
  }
}

export default new PartnerController();
