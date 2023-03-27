import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { BankRegister, BankRegisterId } from './BankRegister';
import type { CashRegister, CashRegisterId } from './CashRegister';
import type { Invoice, InvoiceId } from './Invoice';
import type { Partner, PartnerId } from './Partner';

export interface ReceiptAttributes {
  receipt_id: number;
  invoice_id: number;
  buyer_partner_id: number;
  seller_partner_id: number;
  currency: "RON" | "EUR";
  total_price: number;
  description: string;
  series_number?: number;
  series?: string;
  issued_date: string;
  cash_register_id?: number;
  vat_price: number;
  document_type: "Bon fiscal" | "Chitanta" | "OP" | "Bilet la ordin" | "CEC" | "PV" | "Diurna" | "Bilet de transport" | "Dispozitie de plata" | "Recuperari" | "Dobanda" | "Altele";
  bank_register_id?: number;
  document_number?: string;
  payment_type: "INCASARE" | "PLATA";
}

export type ReceiptPk = "receipt_id";
export type ReceiptId = Receipt[ReceiptPk];
export type ReceiptOptionalAttributes = "receipt_id" | "series_number" | "series" | "cash_register_id" | "bank_register_id" | "document_number";
export type ReceiptCreationAttributes = Optional<ReceiptAttributes, ReceiptOptionalAttributes>;

export class Receipt extends Model<ReceiptAttributes, ReceiptCreationAttributes> implements ReceiptAttributes {
  receipt_id!: number;
  invoice_id!: number;
  buyer_partner_id!: number;
  seller_partner_id!: number;
  currency!: "RON" | "EUR";
  total_price!: number;
  description!: string;
  series_number?: number;
  series?: string;
  issued_date!: string;
  cash_register_id?: number;
  vat_price!: number;
  document_type!: "Bon fiscal" | "Chitanta" | "OP" | "Bilet la ordin" | "CEC" | "PV" | "Diurna" | "Bilet de transport" | "Dispozitie de plata" | "Recuperari" | "Dobanda" | "Altele";
  bank_register_id?: number;
  document_number?: string;
  payment_type!: "INCASARE" | "PLATA";

  // Receipt belongsTo BankRegister via bank_register_id
  bank_register!: BankRegister;
  getBank_register!: Sequelize.BelongsToGetAssociationMixin<BankRegister>;
  setBank_register!: Sequelize.BelongsToSetAssociationMixin<BankRegister, BankRegisterId>;
  createBank_register!: Sequelize.BelongsToCreateAssociationMixin<BankRegister>;
  // Receipt belongsTo CashRegister via cash_register_id
  cash_register!: CashRegister;
  getCash_register!: Sequelize.BelongsToGetAssociationMixin<CashRegister>;
  setCash_register!: Sequelize.BelongsToSetAssociationMixin<CashRegister, CashRegisterId>;
  createCash_register!: Sequelize.BelongsToCreateAssociationMixin<CashRegister>;
  // Receipt belongsTo Invoice via invoice_id
  invoice!: Invoice;
  getInvoice!: Sequelize.BelongsToGetAssociationMixin<Invoice>;
  setInvoice!: Sequelize.BelongsToSetAssociationMixin<Invoice, InvoiceId>;
  createInvoice!: Sequelize.BelongsToCreateAssociationMixin<Invoice>;
  // Receipt belongsTo Partner via buyer_partner_id
  buyer_partner!: Partner;
  getBuyer_partner!: Sequelize.BelongsToGetAssociationMixin<Partner>;
  setBuyer_partner!: Sequelize.BelongsToSetAssociationMixin<Partner, PartnerId>;
  createBuyer_partner!: Sequelize.BelongsToCreateAssociationMixin<Partner>;
  // Receipt belongsTo Partner via seller_partner_id
  seller_partner!: Partner;
  getSeller_partner!: Sequelize.BelongsToGetAssociationMixin<Partner>;
  setSeller_partner!: Sequelize.BelongsToSetAssociationMixin<Partner, PartnerId>;
  createSeller_partner!: Sequelize.BelongsToCreateAssociationMixin<Partner>;

  static initModel(sequelize: Sequelize.Sequelize): typeof Receipt {
    return Receipt.init({
    receipt_id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    invoice_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'Invoice',
        key: 'invoice_id'
      }
    },
    buyer_partner_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'Partner',
        key: 'partner_id'
      }
    },
    seller_partner_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'Partner',
        key: 'partner_id'
      }
    },
    currency: {
      type: DataTypes.ENUM("RON","EUR"),
      allowNull: false
    },
    total_price: {
      type: DataTypes.DECIMAL,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false
    },
    series_number: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    series: {
      type: DataTypes.STRING,
      allowNull: true
    },
    issued_date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    cash_register_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: {
        model: 'CashRegister',
        key: 'cash_register_id'
      }
    },
    vat_price: {
      type: DataTypes.DECIMAL,
      allowNull: false
    },
    document_type: {
      type: DataTypes.ENUM("Bon fiscal","Chitanta","OP","Bilet la ordin","CEC","PV","Diurna","Bilet de transport","Dispozitie de plata","Recuperari","Dobanda","Altele"),
      allowNull: false
    },
    bank_register_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'BankRegister',
        key: 'bank_register_id'
      }
    },
    document_number: {
      type: DataTypes.STRING,
      allowNull: true
    },
    payment_type: {
      type: DataTypes.ENUM("INCASARE", "PLATA"),
        allowNull: false
    }
  }, {
    sequelize,
    tableName: 'Receipt',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "Receipt_pk",
        unique: true,
        fields: [
          { name: "receipt_id" },
        ]
      },
    ]
  });
  }
}
