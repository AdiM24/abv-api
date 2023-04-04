import { CustomRequest } from "./auth.middleware";
import express, { NextFunction } from "express";
import RegisterService from "../services/register.service";
import PartnerService from "../services/partner.service";
import UserPartnerMappingService from "../services/user-partner-mapping.service";

class RegisterMiddleware {
  async validateSufficientFunds(req: CustomRequest, res: express.Response, next: NextFunction) {
    let register;
    if(req.body?.cash_register_id) {
      register = await RegisterService.getCashRegisterById(req.body?.cash_register_id);
    } else if(req.body?.bank_register_id) {
      register = await RegisterService.getBankRegisterById(req.body?.bank_register_id)
    }

    if(!req.body?.total_price) {
      return res.status(400).send({ code: 400, message: "Pretul este obligatoriu" });
    }

    const price = Number(req.body?.total_price);

    if(register.balance < price && req.body?.payment_type === "PLATA") {
      return res.status(400).send({ code: 400, message: "Fonduri insuficiente" });
    }

    if(!req.body?.currency) {
      return res.status(400).send({ code: 400, message: "Valuta este obligatorie" });
    }

    if(register.currency !== req.body?.currency) {
      return res.status(400).send({
        code: 400,
        message: `Nu se pot face operatiuni intre ${register.currency} si ${req.body?.currency}.`
      });
    }

    next();
  }

  async validateUserRegister(req: CustomRequest, res: express.Response, next: NextFunction) {
    const userPartners = await UserPartnerMappingService.getUserPartnerMappings((req.token as any)._id);

    const partner_id = req.body?.payment_type === "PLATA" ? req.body?.buyer_partner_id : req.body?.seller_partner_id;

    if(!userPartners.some(userPartner => userPartner.partner_id === partner_id)) {
      return res.status(400).send({
        code: 400,
        message: "Firma de care apartine casa/contul nu este asociata acestui utilizator"
      });
    }

    next();
  }
}

export default new RegisterMiddleware();