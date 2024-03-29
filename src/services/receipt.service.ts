import { CreateReceiptDto, RemoveReceiptDto } from "../dtos/receipt.dto";
import { sequelize } from "../db/sequelize";
import {BankRegister, CashRegister, initModels, Partner, UserPartnerMap} from "../db/models/init-models";
import UserPartnerMappingService from "./user-partner-mapping.service";
import {getDateRangeQuery, getInQuery, getLikeQuery, getStrictQuery} from "../common/utils/query-utils.service";
import {Op} from "sequelize";

class ReceiptService {
  async getReceipts(decodedJwt: any) {
    const models = initModels(sequelize);

    const userPartners = await UserPartnerMappingService.getUserPartnerMappings(Number(decodedJwt._id));

    return await models.Receipt.findAll({
      where: {
        seller_partner_id: userPartners.map((userPartner: UserPartnerMap) => userPartner.partner_id),
        document_type: "Chitanta"
      },
      include: [
        { model: Partner, as: "seller_partner" },
        { model: Partner, as: "buyer_partner" },
        { model: CashRegister, as: "cash_register" }
      ]
    });
  }

  async getFilteredReceipts(queryParams: any, decodedJwt: any) {
    const models = initModels(sequelize);

    const userPartnerIds = (await UserPartnerMappingService.getUserPartnerMappings(Number(decodedJwt._id))).map(
      (userPartner: UserPartnerMap) => userPartner.partner_id);

    const queryObject = {} as any;

    queryObject.seller_partner_id = getInQuery(userPartnerIds);
    queryObject.document_type = 'Chitanta';

    if (queryParams.series) {
      queryObject.series = getLikeQuery(queryParams.series);
    }

    if (queryParams.number) {
      queryObject.number = getStrictQuery(queryParams.number);
    }

    if (queryParams.created_from || queryParams.created_to) {
      queryObject.created_at_utc = getDateRangeQuery(queryParams.created_from, queryParams.created_to);
    }

    return await models.Receipt.findAll({
      where: {
        [Op.and]: {
          ...queryObject
        }
      },
      include: [
        { model: Partner, as: "seller_partner" },
        { model: Partner, as: "buyer_partner" },
        { model: CashRegister, as: "cash_register" }
      ]
    });
  }

  async getReceiptById(receiptId: number) {
    const models = initModels(sequelize);

    return await models.Receipt.findOne({
      where: {
        receipt_id: receiptId
      },
      include: [
        { model: Partner, as: "seller_partner" },
        { model: Partner, as: "buyer_partner" },
        { model: CashRegister, as: "cash_register" },
        { model: BankRegister, as: "bank_register" }
      ]
    })
  }

  async addReceipt(receiptToAdd: any) {
    const models = initModels(sequelize);

    const invoiceToUpdate = await models.Invoice.findOne({
      where: {
        invoice_id: receiptToAdd.invoice_id
      }
    })

    const cashRegisterToUpdate = await models.CashRegister.findOne({
      where: {
        cash_register_id: receiptToAdd.cash_register_id
      }
    });

    invoiceToUpdate.total_paid_price = parseFloat(
      (Number(invoiceToUpdate.total_paid_price) +
       Number(receiptToAdd.total_price)).toFixed(2));

    cashRegisterToUpdate.balance = parseFloat((Number(cashRegisterToUpdate.balance) +
                                   Number(receiptToAdd.total_price)).toFixed(2));

    if(Math.abs(invoiceToUpdate.total_price_incl_vat - invoiceToUpdate.total_paid_price) < 0.001) {
      invoiceToUpdate.status = "paid"
    } else if(invoiceToUpdate.total_paid_price < 0.001) {
      invoiceToUpdate.status = "unpaid"
    } else {
      invoiceToUpdate.status = "incomplete payment"
    }

    receiptToAdd.document_type = 'Chitanta';

    await invoiceToUpdate.save();
    await cashRegisterToUpdate.save();

    return await models.Receipt.create(receiptToAdd);
  }

  async addOperation(operationToAdd: any) {
    const models = initModels(sequelize);

    const invoiceToUpdate = await models.Invoice.findOne({
      where: {
        invoice_id: operationToAdd.invoice_id
      }
    })

    let registerToUpdate;
    if(operationToAdd.cash_register_id) {
      registerToUpdate = await models.CashRegister.findOne({
        where: {
          cash_register_id: operationToAdd.cash_register_id
        }
      });
    } else {
      registerToUpdate = await models.BankRegister.findOne({
        where: {
          bank_register_id: operationToAdd.bank_register_id
        }
      });
    }

    invoiceToUpdate.total_paid_price = parseFloat(
      (Number(invoiceToUpdate.total_paid_price) +
        Number(operationToAdd.total_price)).toFixed(2));

    if(operationToAdd.payment_type === 'INCASARE') {
      registerToUpdate.balance = parseFloat((Number(registerToUpdate.balance) +
        Number(operationToAdd.total_price)).toFixed(2));
    } else {
      registerToUpdate.balance = parseFloat((Number(registerToUpdate.balance) -
        Number(operationToAdd.total_price)).toFixed(2));
    }

    if(Math.abs(invoiceToUpdate.total_price_incl_vat - invoiceToUpdate.total_paid_price) < 0.001) {
      invoiceToUpdate.status = "paid"
    } else if(invoiceToUpdate.total_paid_price < 0.001) {
      invoiceToUpdate.status = "unpaid"
    } else {
      invoiceToUpdate.status = "incomplete payment"
    }

    await invoiceToUpdate.save();
    await registerToUpdate.save();

    operationToAdd.document_number = operationToAdd.document_number || null;

    return await models.Receipt.create(operationToAdd);
  }

  async findNextSeriesNumber(series: string) {
    const models = initModels(sequelize);

    const latestInvoiceNumberForSeries = (await models.Receipt.findOne({
      where: {
        series: series.toUpperCase()
      },
      order: [["series_number", "DESC"]]
    }))?.get('series_number');

    if (!latestInvoiceNumberForSeries) {
      return 1;
    }

    return Number(latestInvoiceNumberForSeries) + 1;
  }

  async removeReceipt(receiptToRemove: RemoveReceiptDto) {
    const models = initModels(sequelize);

    const invoiceToUpdate = await models.Invoice.findOne({
      where: {
        invoice_id: receiptToRemove.invoice_id
      }
    })

    const cashRegisterToUpdate = await models.CashRegister.findOne({
      where: {
        cash_register_id: receiptToRemove.cash_register_id
      }
    });

    invoiceToUpdate.total_paid_price = parseFloat(
      (Number(invoiceToUpdate.total_paid_price) -
        Number(receiptToRemove.total_price)).toFixed(2));

    cashRegisterToUpdate.balance = parseFloat(
      (Number(cashRegisterToUpdate.balance) -
        Number(receiptToRemove.total_price)).toFixed(2));

    if(Math.abs(invoiceToUpdate.total_price_incl_vat - invoiceToUpdate.total_paid_price) < 0.001) {
      invoiceToUpdate.status = "paid"
    } else if(invoiceToUpdate.total_paid_price < 0.001) {
      invoiceToUpdate.status = "unpaid"
    } else {
      invoiceToUpdate.status = "incomplete payment"
    }

    try {
      await invoiceToUpdate.save();
      await cashRegisterToUpdate.save();
      await models.Receipt.destroy({
        where: {
          receipt_id: receiptToRemove.receipt_id
        }
      });

      return {code: 200, message: `Chitanta a fost stearsa.`}
    } catch (err) {
      console.error(err);
    }
  }
}

export default new ReceiptService();