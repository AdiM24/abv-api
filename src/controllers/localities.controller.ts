import express from "express";
import LocalitiesService from "../services/localities.service";

class LocalitiesController {

  async getCounties(req: express.Request, res: express.Response) {
    res.status(200).send(await LocalitiesService.getCounties(req.query?.searchKey?.toString()))
  }

  async getCities(req: express.Request, res: express.Response) {
      res.status(200).send(await LocalitiesService.getCities(req.query?.county?.toString(), req.query?.searchKey?.toString()))
  }
}

export default new LocalitiesController();
