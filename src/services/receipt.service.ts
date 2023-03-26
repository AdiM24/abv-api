import { CreateReceiptDto, RemoveReceiptDto } from "../dtos/receipt.dto";
import { sequelize } from "../db/sequelize";
import { CashRegister, initModels, InvoiceAttributes, Partner } from "../db/models/init-models";
import PartnerService from "./partner.service";
import { WhereOptions } from "sequelize";

class ReceiptService {
  async getReceipts(decodedJwt: any) {
    const models = initModels(sequelize);

    const userPartners = await PartnerService.getUserPartners(decodedJwt._id);

    return await models.Receipt.findAll({
      where: {
        seller_partner_id: userPartners.map((userPartner: Partner) => userPartner.partner_id)
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
        { model: CashRegister, as: "cash_register" }
      ]
    })
  }

  async addReceipt(receiptToAdd: CreateReceiptDto) {
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

    await invoiceToUpdate.save();
    await cashRegisterToUpdate.save();

    return await models.Receipt.create(receiptToAdd);
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