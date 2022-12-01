import express from "express";
import { ResponseError } from "../common/models/common.types";
import AuthService from "../services/auth.service";

class AuthController {
  async login(req: express.Request, res: express.Response) {
    const token = await AuthService.login(req.body);

    if (typeof token === "string") {
      res.status(400).send({ errorCode: 400, message: token } as ResponseError);
    }

    res.status(200).send(token);
  }
}

export default new AuthController();
