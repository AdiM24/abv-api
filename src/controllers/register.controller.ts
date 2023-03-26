import express from "express";
import RegisterService from "../services/register.service";
import { CustomRequest } from "../middleware/auth.middleware";
import AutoFleetService from "../services/auto-fleet.service";

class RegisterController {
  async getBankRegisters(req: CustomRequest, res: express.Response) {
    const bankRegisters = Object.keys(req.query).length
      ? await RegisterService.getFilteredBankRegisters(req.query)
      : await RegisterService.getBankRegisters(req.token);

    res.status(200).send(bankRegisters);
  }

  async getBankRegisterById(req: express.Request, res: express.Response) {
    const bankRegisterId = Number(req.params?.id);

    const bankRegister = await RegisterService.getBankRegisterById(bankRegisterId);

    res.status(200).send(bankRegister);
  }

  async getCashRegisterById(req: express.Request, res: express.Response) {
    const cashRegisterId = Number(req.params?.id);

    const cashRegister = await RegisterService.getCashRegisterById(cashRegisterId);

    res.status(200).send(cashRegister)
  }

  async getCashRegisters(req: CustomRequest, res: express.Response) {
    const cashRegisters = Object.keys(req.query).length
      ? await RegisterService.getFilteredCashRegisters(req.query)
      : await RegisterService.getCashRegisters(req.token);

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