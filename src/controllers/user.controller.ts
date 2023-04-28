import express from "express";
import debug from "debug";
import UserService from "../services/user.service";
import {CustomRequest} from "../middleware/auth.middleware";
import EmailService from "../services/email.service";
import UserPartnerMappingService from "../services/user-partner-mapping.service";

const log: debug.IDebugger = debug("app:users-controller");

class UsersController {
  async getUsers(req: express.Request, res: express.Response) {
    const users = await UserService.getAll();

    res.status(200).send(users);
  }

  async createUser(req: express.Request, res: express.Response) {
    const msg = await UserService.createUser(req.body);

    res.status(201).send({msg});
  }

  async createUsers(req: express.Request, res: express.Response) {
    const msg = await UserService.createUsers(req.body);

    res.status(201).send({msg});
  }

  async createUserSeries(req: CustomRequest, res: express.Response) {
    const created = await UserService.createUserSeries(req.body, req.token);

    res.status(201).send(created);
  }

  async getUserSeries(req: CustomRequest, res: express.Response) {
    const userId = (req.token as any)._id
    const userSeries = await UserService.getUserSeries(userId, req.body.invoice_type, req.body.is_default || false);

    res.status(200).send(userSeries);
  }

  async changeDefaultSeries(req: express.Request, res: express.Response) {
    const newDefault = await UserService.changeDefaultSeries(req.body);

    res.status(200).send(newDefault);
  }

  async createUserPartnerEmail(req: CustomRequest, res: express.Response) {
    const result = await UserService.createUserPartnerEmail(req.body);

    res.status(200).send(result);
  }

  async getUserPartnerEmails(req: CustomRequest, res: express.Response) {
    const userEmails = await UserService.getUserPartnerEmails(req.token);

    res.status(200).send(userEmails);
  }

  async updateUserPartnerEmail(req: CustomRequest, res: express.Response) {
    const result = await UserService.updateUserPartnerEmail(req.body);

    res.status(200).send(result)
  }

  async removeUserPartnerEmail(req: CustomRequest, res: express.Response) {
    const result = await UserService.removeUserPartnerEmail(Number(req.query?.user_partner_email));

    res.status(200).send(result);
  }

  async getUserPartner(req: CustomRequest, res: express.Response) {
    const userPartner = await UserPartnerMappingService.getUserPartnerMappings(Number((req.token as any)._id));

    return res.status(200).send(userPartner[0]);
  }

  async changePassword(req: express.Request, res: express.Response) {
    await UserService.changeUserPassword(req.body);

    return res.status(200).send({message:'success'});
  }
}

export default new UsersController();
