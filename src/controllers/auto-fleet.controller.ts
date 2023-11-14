import express from "express";
import AutoFleetService from "../services/auto-fleet.service";
import {CustomRequest} from "../middleware/auth.middleware";

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

  async getAutoFleetOptions(req: CustomRequest, res: express.Response) {
    const autoFleetOptions = await AutoFleetService.getAutoFleetOptions(req.token);

    res.status(200).send(autoFleetOptions);
  }

  async autoFleetExpenses(req: express.Request, res: express.Response) {
    const result = await AutoFleetService.autoFleetExpenses(req.params?.id);

    return res.status(result?.code).send({
      "Cheltuieli Totale": result?.message
    });
  }

}

export default new AutoFleetController();