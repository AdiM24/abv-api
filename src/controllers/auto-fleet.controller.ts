import express from "express";
import AutoFleetService from "../services/auto-fleet.service";
import {CustomRequest} from "../middleware/auth.middleware";
import InvoiceService from "../services/invoice.service";

class AutoFleetController {
  async createAutoFleet(req: express.Request, res: express.Response) {
    const createdAutoFleet = await AutoFleetService.createAutoFleet(req.body);

    return res.status(201).send(createdAutoFleet);
  }

  async updateAutoFleet(req: express.Request, res: express.Response) {
    const updatedVehicle = await AutoFleetService.updateAutoFleet(req.body);

    return res.status(200).send(updatedVehicle);
  }

  async deleteAutoFleet(req: CustomRequest, res: express.Response) {
    const result = await AutoFleetService.removeAutoFleet(Number(req.params?.id));

    return res.status(200).send(result);
  }

  async getAutoFleets(req: CustomRequest, res: express.Response) {
    const autoFleets = Object.keys(req.query).length
      ? await AutoFleetService.getFilteredAutoFleets(req.query, req.token)
      : await AutoFleetService.getAutoFleets(req.token);

    return res.status(200).send(autoFleets);
  }

  async getAutoFleet(req: express.Request, res: express.Response) {
    const autoFleet = await AutoFleetService.getAutoFleet(Number(req.params?.id));

    return res.status(200).send(autoFleet);
  }
}

export default new AutoFleetController();