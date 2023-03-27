import { sequelize } from "../db/sequelize";
import { initModels, Partner, TimesheetEntry } from "../db/models/init-models";
import PartnerService from "./partner.service";
import { BankRegisterAddDto } from "../dtos/bank-register.dto";
import { CashRegisterAddDto } from "../dtos/cash-register.dto";
import { getStrictQuery } from "../common/utils/query-utils.service";
import { Op } from "sequelize";

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

  async getBankRegisterById(bankRegisterId: number) {
    const models = initModels(sequelize);

    return await models.BankRegister.findOne({
      where: {
        bank_register_id: bankRegisterId
      },
      include: [{model: Partner, as: "partner"}]
    })
  }

  async getFilteredBankRegisters(queryParams: any) {
    const models = initModels(sequelize);

    const queryObject = {} as any;

    if(queryParams.partner_id) {
      queryObject.partner_id = getStrictQuery(queryParams.partner_id);
    }

    if(queryParams.currency) {
      queryObject.currency = getStrictQuery(queryParams.currency)
    }

    return await models.BankRegister.findAll({
      where: {
        [Op.and]: {
          ...queryObject,
        }
      }
    })
  }


  async getFilteredCashRegisters(queryParams: any) {
    const models = initModels(sequelize);

    const queryObject = {} as any;

    if(queryParams.partner_id) {
      queryObject.partner_id = getStrictQuery(queryParams.partner_id);
    }

    if(queryParams.currency) {
      queryObject.currency = getStrictQuery(queryParams.currency)
    }

    return await models.CashRegister.findAll({
      where: {
        [Op.and]: {
          ...queryObject,
        }
      }
    })
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

  async getCashRegisterById(cashRegisterId: number) {
    const models = initModels(sequelize);

    return await models.CashRegister.findOne({
      where: {
        cash_register_id: cashRegisterId
      },
      include: [{model: Partner, as: "partner"}]
    })
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

  async getCashOperations(cash_register_id: number) {
    const models = initModels(sequelize);

    return await models.Receipt.findAll({
      where: {
        cash_register_id: cash_register_id
      },
      include: [
        {model: Partner, as: "seller_partner"},
        {model: Partner, as: "buyer_partner"},
      ]
    });
  }

  async getBankOperations(bank_register_id: number) {
    const models = initModels(sequelize);

    return await models.Receipt.findAll({
      where: {
        bank_register_id: bank_register_id
      },
      include: [
        {model: Partner, as: "seller_partner"},
        {model: Partner, as: "buyer_partner"},
      ]
    });
  }
}

export default new RegisterService();