import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { Partner, PartnerId } from './Partner';
import type { Receipt, ReceiptId } from './Receipt';

export interface CashRegisterAttributes {
  cash_register_id: number;
  name: string;
  balance: number;
  partner_id: number;
  currency: "EUR" | "RON";
}

export type CashRegisterPk = "cash_register_id";
export type CashRegisterId = CashRegister[CashRegisterPk];
export type CashRegisterOptionalAttributes = "cash_register_id";
export type CashRegisterCreationAttributes = Optional<CashRegisterAttributes, CashRegisterOptionalAttributes>;

export class CashRegister extends Model<CashRegisterAttributes, CashRegisterCreationAttributes> implements CashRegisterAttributes {
  cash_register_id!: number;
  name!: string;
  balance!: number;
  partner_id!: number;
  currency!: "EUR" | "RON";

  // CashRegister hasMany Receipt via cash_register_id
  Receipts!: Receipt[];
  getReceipts!: Sequelize.HasManyGetAssociationsMixin<Receipt>;
  setReceipts!: Sequelize.HasManySetAssociationsMixin<Receipt, ReceiptId>;
  addReceipt!: Sequelize.HasManyAddAssociationMixin<Receipt, ReceiptId>;
  addReceipts!: Sequelize.HasManyAddAssociationsMixin<Receipt, ReceiptId>;
  createReceipt!: Sequelize.HasManyCreateAssociationMixin<Receipt>;
  removeReceipt!: Sequelize.HasManyRemoveAssociationMixin<Receipt, ReceiptId>;
  removeReceipts!: Sequelize.HasManyRemoveAssociationsMixin<Receipt, ReceiptId>;
  hasReceipt!: Sequelize.HasManyHasAssociationMixin<Receipt, ReceiptId>;
  hasReceipts!: Sequelize.HasManyHasAssociationsMixin<Receipt, ReceiptId>;
  countReceipts!: Sequelize.HasManyCountAssociationsMixin;
  // CashRegister belongsTo Partner via partner_id
  partner!: Partner;
  getPartner!: Sequelize.BelongsToGetAssociationMixin<Partner>;
  setPartner!: Sequelize.BelongsToSetAssociationMixin<Partner, PartnerId>;
  createPartner!: Sequelize.BelongsToCreateAssociationMixin<Partner>;

  static initModel(sequelize: Sequelize.Sequelize): typeof CashRegister {
    return CashRegister.init({
    cash_register_id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    balance: {
      type: DataTypes.DECIMAL,
      allowNull: false
    },
    partner_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'Partner',
        key: 'partner_id'
      }
    },
    currency: {
      type: DataTypes.ENUM("EUR","RON"),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'CashRegister',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "CashRegister_pk",
        unique: true,
        fields: [
          { name: "cash_register_id" },
        ]
      },
    ]
  });
  }
}
