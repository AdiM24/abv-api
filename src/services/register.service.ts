import { sequelize } from "../db/sequelize";
import { initModels, Partner, TimesheetEntry } from "../db/models/init-models";
import PartnerService from "./partner.service";
import { BankRegisterAddDto } from "../dtos/bank-register.dto";
import { CashRegisterAddDto } from "../dtos/cash-register.dto";

class RegisterService {
  async getBankRegisters(decodedJwt: any) {
    const models = initModels(sequelize);

    const userPartners = await PartnerService.getUserPartners(decodedJwt._id);

    return await models.BankRegister.findAll({
      where: {
        partner_id: userPartners.map((userPartner: Partner) => userPartner.partner_id)
      },
      include: [{model: Partner, as: "partner"}]
    });
  }

  async getCashRegisters(decodedJwt: any) {
    const models = initModels(sequelize);

    const userPartners = await PartnerService.getUserPartners(decodedJwt._id);

    return await models.CashRegister.findAll({
      where: {
        partner_id: userPartners.map((userPartner: Partner) => userPartner.partner_id)
      },
      include: [{model: Partner, as: "partner"}]
    });
  }

  async addBankRegister(bankRegisterToAdd: BankRegisterAddDto) {
    const models = initModels(sequelize);

    return await models.BankRegister.create(bankRegisterToAdd);
  }

  async addCashRegister(cashRegisterToAdd: CashRegisterAddDto) {
    const models = initModels(sequelize);

    return await models.CashRegister.create(cashRegisterToAdd);
  }

  async removeBankRegister(bank_register_id: number) {
    const models = initModels(sequelize);

    try {
      await models.BankRegister.destroy({
        where: {
          bank_register_id: bank_register_id
        }
      });

      return {code: 200, message: `Registrul a fost sters.`}
    } catch (err) {
      console.error(err);
    }
  }

  async removeCashRegister(cash_register_id: number) {
    const models = initModels(sequelize);

    try {
      await models.CashRegister.destroy({
        where: {
          cash_register_id: cash_register_id
        }
      });

      return {code: 200, message: `Registrul a fost sters.`}
    } catch (err) {
      console.error(err);
    }
  }
}

export default new RegisterService();