import express from "express";
import debug from "debug";
import UserService from "../services/user.service";
import {CustomRequest} from "../middleware/auth.middleware";

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
}

export default new UsersController();
