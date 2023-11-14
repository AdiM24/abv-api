import express from "express";
import {ResponseError} from "../common/models/common.types";
import partnerService from "../services/partner.service";
import PartnerService from "../services/partner.service";
import {CustomRequest} from "../middleware/auth.middleware";

class PartnerController {
  async addPartner(req: CustomRequest, res: express.Response) {
    const addedPartnerId = await PartnerService.addPartner(req.body, req.token);

    res.status(201).send({created: addedPartnerId, msg: "Partner created"});
  }

  async getAutocompleteOptions(req: express.Request, res: express.Response) {
    res.status(200).send(await PartnerService.getPartnerAutocompleteOptions(req.query?.searchKey.toString()));
  }

  async getUserAutocompleteOptions(req: CustomRequest, res: express.Response) {
    res.status(200).send(await PartnerService.getPartnerAutocompleteOptions(req.query?.searchKey.toString(), req.token))
  }

  async getAddressAutocompleteOptions(req: CustomRequest, res: express.Response) {
    res.status(200).send(await PartnerService.getPartnerAddressOptions(req.query?.searchKey.toString(), req.token));
  }

  async getPartners(req: express.Request, res: express.Response) {

    const partners = Object.keys(req.query).length
      ? await PartnerService.getFilteredPartners(req.query)
      : await PartnerService.getPartners();

    res.status(200).send(partners);
  }

  async getUserPartners(req: CustomRequest, res: express.Response) {
    const userPartners = await PartnerService.getUserPartners(req.token);

    res.status(200).send(userPartners);
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

  async getLoggedInPartner(req: CustomRequest, res: express.Response) {
    const partner = await PartnerService.getLoggedInPartner(req.token);

    res.status(partner.code).send({
      message: partner.message
    });
  }

  async addPartnerBankAccount(req:express.Request, res: express.Response) {
    const result = await PartnerService.addPartnerBankAccount(req.body);

    return res.status(200).send(result);
  }

  async addPartnerAddress(req:express.Request, res: express.Response) {
    const result = await PartnerService.addPartnerAddress(req.body);

    return res.status(200).send(result);
  }

  async addPartnerContact(req: express.Request, res: express.Response) {
    const result = await PartnerService.addPartnerContact(req.body);

    return res.status(201).send(result);
  }

  async updatePartnerAddress(req: express.Request, res: express.Response) {
    const result = await PartnerService.updatePartnerAddress(req.body)

    return res.status(200).send(result);
  }

  async updatePartnerBankAccounts(req: express.Request, res: express.Response) {
    const result = await PartnerService.updatePartnerBankAccount(req.body)

    return res.status(200).send(result);
  }

  async updatePartnerContact(req: express.Request, res: express.Response) {
    const result = await PartnerService.updatePartnerContact(req.body)

    return res.status(200).send(result);
  }

  async updatePartner(req: express.Request, res: express.Response) {
    const result = await PartnerService.updatePartner(req.body);

    return res.status(200).send(result);
  }

  async getPartnerComments(req: express.Request, res: express.Response) {
    const result = await PartnerService.getPartnerComments(Number(req.query.partner_id));

    res.status(200).send(result);
  }

  async addPartnerComment(req: CustomRequest, res: express.Response) {
    const result = await PartnerService.addPartnerComment(req.body, req.token);

    res.status(201).send(result);
  }

  async deletePartnerComment(req: CustomRequest, res: express.Response) {
    const result = await PartnerService.deletePartnerComment(req.body.partner_comment_id);

    res.status(200).send(result);
  }

  async deletePartnerContact(req: express.Request, res: express.Response) {
    const result = await PartnerService.deletePartnerContact(req.body.contact_id);

    res.status(200).send(result);
  }

  async deletePartnerAddress(req: express.Request, res: express.Response) {
    const result = await PartnerService.deletePartnerAddress(req.body.address_id);

    res.status(result.code).send(result);
  }

  async deletePartnerBankAccount(req: express.Request, res: express.Response) {
    const result = await PartnerService.deletePartnerBankAccount(req.body.bank_account_id);

    res.status(result.code).send(result);
  }
}

export default new PartnerController();
