import express from "express";
import UsersService from "../services/users.service";
import debug from "debug";

const log: debug.IDebugger = debug('app:users-controller');

class UsersController {
    async getUsers(req: express.Request, res: express.Response) {
        const users = await UsersService.getAll();

        res.status(200).send(users);
    }

    async createUser(req: express.Request, res: express.Response) {
        const msg = await UsersService.createUser(req.body);

        res.status(201).send({msg})
    }
}

export default new UsersController();