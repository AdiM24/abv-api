import express from "express";
import UsersService from "../services/users.service";

class UsersController {
    public path = '/user';
    public router = express.Router();

    async getUsers(req: express.Request, res: express.Response) {
        const users = await UsersService.getAll();
        res.status(200).send(users);
    }
}

export default new UsersController();