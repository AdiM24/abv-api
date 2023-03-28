import EmailService from "../services/email.service";
import express from "express";
import {CustomRequest} from "../middleware/auth.middleware";

class EmailController {
  async sendEmail(req: CustomRequest, res: express.Response) {
    console.log(req);
    const result = await EmailService.sendEmail(req.body, req.token);

    if (result.code === 500) {
      res.status(500).send(result);
    } else {
      res.status(200).send(result);
    }
  }
}

export default new EmailController();