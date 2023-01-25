import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { InvoiceProduct, InvoiceProductId } from './InvoiceProduct';

export interface InvoiceAttributes {
  invoice_id: number;
  client_id: number;
  buyer_id: number;
  deadline_at_utc: Date;
  created_at_utc?: Date;
  status: "paid" | "overdue" | "incomplete payment" | "unpaid";
  type: "proforma" | "issued" | "received";
  number: number;
  series: string;
  sent_status?: "sent" | "not sent";
}

export type InvoicePk = "invoice_id";
export type InvoiceId = Invoice[InvoicePk];
export type InvoiceOptionalAttributes = "invoice_id" | "deadline_at_utc" | "created_at_utc" | "sent_status";
export type InvoiceCreationAttributes = Optional<InvoiceAttributes, InvoiceOptionalAttributes>;

export class Invoice extends Model<InvoiceAttributes, InvoiceCreationAttributes> implements InvoiceAttributes {
  invoice_id!: number;
  client_id!: number;
  buyer_id!: number;
  deadline_at_utc!: Date;
  created_at_utc?: Date;
  status!: "paid" | "overdue" | "incomplete payment" | "unpaid";
  type!: "proforma" | "issued" | "received";
  number!: number;
  series!: string;
  sent_status?: "sent" | "not sent";

  // Invoice hasMany InvoiceProducts via invoice_id
  InvoiceProducts!: InvoiceProduct[];
  getInvoiceProducts!: Sequelize.HasManyGetAssociationsMixin<InvoiceProduct>;
  setInvoiceProducts!: Sequelize.HasManySetAssociationsMixin<InvoiceProduct, InvoiceProductId>;
  addInvoiceProduct!: Sequelize.HasManyAddAssociationMixin<InvoiceProduct, InvoiceProductId>;
  addInvoiceProducts!: Sequelize.HasManyAddAssociationsMixin<InvoiceProduct, InvoiceProductId>;
  createInvoiceProduct!: Sequelize.HasManyCreateAssociationMixin<InvoiceProduct>;
  removeInvoiceProduct!: Sequelize.HasManyRemoveAssociationMixin<InvoiceProduct, InvoiceProductId>;
  removeInvoiceProducts!: Sequelize.HasManyRemoveAssociationsMixin<InvoiceProduct, InvoiceProductId>;
  hasInvoiceProduct!: Sequelize.HasManyHasAssociationMixin<InvoiceProduct, InvoiceProductId>;
  hasInvoiceProducts!: Sequelize.HasManyHasAssociationsMixin<InvoiceProduct, InvoiceProductId>;
  countInvoiceProducts!: Sequelize.HasManyCountAssociationsMixin;

  static initModel(sequelize: Sequelize.Sequelize): typeof Invoice {
    return Invoice.init({
    invoice_id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    client_id: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    buyer_id: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    deadline_at_utc: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.literal("(now() AT TIME ZONE 'utc'::text)")
    },
    created_at_utc: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.literal("(now() AT TIME ZONE 'utc'::text)")
    },
    status: {
      type: DataTypes.ENUM("paid","overdue","incomplete payment","unpaid"),
      allowNull: false
    },
    type: {
      type: DataTypes.ENUM("proforma","issued","received"),
      allowNull: false
    },
    number: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    series: {
      type: DataTypes.STRING,
      allowNull: false
    },
    sent_status: {
      type: DataTypes.ENUM("sent","not sent"),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'Invoice',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "Invoice_pk",
        unique: true,
        fields: [
          { name: "invoice_id" },
        ]
      },
    ]
  });
  }
}
