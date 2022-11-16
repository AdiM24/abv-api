import express from "express";
import AuthService from "../services/auth.service";

class AuthController {
  async login(req: express.Request, res: express.Response) {
    const token = await AuthService.login(req.body);

    if (typeof token === "string") {
      res.status(400).send(token);
    }

    res.status(200).send(token);
  }
}

export default new AuthController();
