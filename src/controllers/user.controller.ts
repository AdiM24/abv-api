import express from "express";
import debug from "debug";
import UserService from "../services/user.service";

const log: debug.IDebugger = debug("app:users-controller");

class UsersController {
  async getUsers(req: express.Request, res: express.Response) {
    const users = await UserService.getAll();

    res.status(200).send(users);
  }

  async createUser(req: express.Request, res: express.Response) {
    const msg = await UserService.createUser(req.body);

    res.status(201).send({ msg });
  }

  async createUsers(req: express.Request, res: express.Response) {
    const msg = await UserService.createUsers(req.body);

    res.status(201).send({ msg });
  }
}

export default new UsersController();
