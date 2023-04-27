import express, {NextFunction} from "express";
import ImageService from "../services/image.service";

class ImageMiddleware {
  async validateOneLogo(req: express.Request, res: express.Response, next: NextFunction) {
    const existingLogo = await ImageService.getImageDetails(Number(req.body.partner_id));

    if (existingLogo) {
      return res.status(400).send({code: 400, message:'Exista deja un logo pentru firma selectata!'});
    }

    next();
  }
}

export default new ImageMiddleware();