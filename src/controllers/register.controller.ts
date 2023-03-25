import express from "express";
import RegisterService from "../services/register.service";
import { CustomRequest } from "../middleware/auth.middleware";
import AutoFleetService from "../services/auto-fleet.service";

class RegisterController {
  async getBankRegisters(req: CustomRequest, res: express.Response) {
    const bankRegisters = await RegisterService.getBankRegisters(req.token);

    res.status(200).send(bankRegisters);
  }

  async getCashRegisters(req: CustomRequest, res: express.Response) {
    const cashRegisters = await RegisterService.getCashRegisters(req.token);

    res.status(200).send(cashRegisters);
  }

  async addBankRegister(req: express.Request, res: express.Response) {
    const addedBankRegister = await RegisterService.addBankRegister(req.body);

    res.status(200).send(addedBankRegister);
  }

  async addCashRegister(req: express.Request, res: express.Response) {
    const addedBankRegister = await RegisterService.addCashRegister(req.body);

    res.status(200).send(addedBankRegister);
  }

  async removeBankRegister(req: CustomRequest, res: express.Response) {
    const result = await RegisterService.removeBankRegister(Number(req.params?.id));

    return res.status(200).send(result);
  }

  async removeCashRegister(req: CustomRequest, res: express.Response) {
    const result = await RegisterService.removeCashRegister(Number(req.params?.id));

    return res.status(200).send(result);
  }
}

export default new RegisterController();