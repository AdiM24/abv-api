import express from "express";
import AuthService from "../services/auth.service";

class AuthController {
    async login(req: express.Request, res: express.Response) {
        const token = await AuthService.login(req.body);

        res.status(200).send(token);
    }
}

export default new AuthController();