import {CustomRequest} from "../middleware/auth.middleware";
import express from "express";
import ImageService from "../services/image.service";

class ImageController {

  async getImage(req: CustomRequest, res: express.Response) {
    const image = await ImageService.getImage(
      {
        type: req.query?.type,
        partner_id: Number(req.query?.partner_id)
      });

    if (image.code) {
      return res.status(image.code).send({code: image.code, message: image.message})
    }
    return res.type(image.type).sendFile(image.image);
  }

  async uploadImage(req: CustomRequest, res: express.Response) {
    const result = await ImageService.uploadImage(req.body, req.file);

    res.status(result.code).send({code: result.code, message: result.message});
  }
  
  async removeImage(req: CustomRequest, res: express.Response) {
    const result = await ImageService.removeImage(Number(req.query?.partner_id));

    res.status(result.code).send({code: result.code, message: result.message});
  }

}

export default new ImageController();