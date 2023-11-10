import express from "express";
import DevizService from "../services/deviz.service";

class DevizController {
  async getDeviz(req: express.Request, res: express.Response) {
    const result = await DevizService.getDeviz(req.params?.id);

    res.status(result?.code).json({
      message: result?.message
    });
  }

  async getDevize(req: express.Request, res: express.Response) {
    const result = Object.keys(req.query).length
      ? await DevizService.getFilteredDevize(req.query)
      : await DevizService.getDevize();

    res.status(result?.code).send({
      message: result?.message
    });
  }

  async createDeviz(req: express.Request, res: express.Response) {
    const result = await DevizService.createDeviz(req.body);

    res.status(result?.code).send({
      message: result?.message
    });
  }

  async updateDeviz(req: express.Request, res: express.Response) {
    const result = await DevizService.updateDeviz(req.params?.id, req.body);

    res.status(result?.code).send({
      message: result?.message
    });
  }

  async deleteDeviz(req: express.Request, res: express.Response) {
    const result = await DevizService.deleteDeviz(req.params?.id);

    res.status(result?.code).send({
      message: result?.message
    });
  }
}

export default new DevizController();
