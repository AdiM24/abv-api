import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { Partner, PartnerId } from './Partner';
import type { Receipt, ReceiptId } from './Receipt';

export interface BankRegisterAttributes {
  bank_register_id: number;
  iban: string;
  balance: number;
  partner_id: number;
  currency: "RON" | "EUR";
}

export type BankRegisterPk = "bank_register_id";
export type BankRegisterId = BankRegister[BankRegisterPk];
export type BankRegisterOptionalAttributes = "bank_register_id";
export type BankRegisterCreationAttributes = Optional<BankRegisterAttributes, BankRegisterOptionalAttributes>;

export class BankRegister extends Model<BankRegisterAttributes, BankRegisterCreationAttributes> implements BankRegisterAttributes {
  bank_register_id!: number;
  iban!: string;
  balance!: number;
  partner_id!: number;
  currency!: "RON" | "EUR";

  // BankRegister hasMany Receipt via bank_register_id
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
  // BankRegister belongsTo Partner via partner_id
  partner!: Partner;
  getPartner!: Sequelize.BelongsToGetAssociationMixin<Partner>;
  setPartner!: Sequelize.BelongsToSetAssociationMixin<Partner, PartnerId>;
  createPartner!: Sequelize.BelongsToCreateAssociationMixin<Partner>;

  static initModel(sequelize: Sequelize.Sequelize): typeof BankRegister {
    return BankRegister.init({
    bank_register_id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    iban: {
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
      type: DataTypes.ENUM("RON","EUR"),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'BankRegister',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "BankRegister_pk",
        unique: true,
        fields: [
          { name: "bank_register_id" },
        ]
      },
    ]
  });
  }
}
