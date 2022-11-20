import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { Partner, PartnerId } from './Partner';

export interface BankAccountAttributes {
  bank_account_id: number;
  iban: string;
  bank_name: string;
  currency: string;
  partner_id?: number;
}

export type BankAccountPk = "bank_account_id";
export type BankAccountId = BankAccount[BankAccountPk];
export type BankAccountOptionalAttributes = "bank_account_id" | "partner_id";
export type BankAccountCreationAttributes = Optional<BankAccountAttributes, BankAccountOptionalAttributes>;

export class BankAccount extends Model<BankAccountAttributes, BankAccountCreationAttributes> implements BankAccountAttributes {
  bank_account_id!: number;
  iban!: string;
  bank_name!: string;
  currency!: string;
  partner_id?: number;

  // BankAccount belongsTo Partner via partner_id
  partner!: Partner;
  getPartner!: Sequelize.BelongsToGetAssociationMixin<Partner>;
  setPartner!: Sequelize.BelongsToSetAssociationMixin<Partner, PartnerId>;
  createPartner!: Sequelize.BelongsToCreateAssociationMixin<Partner>;

  static initModel(sequelize: Sequelize.Sequelize): typeof BankAccount {
    return BankAccount.init({
    bank_account_id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    iban: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    bank_name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    currency: {
      type: DataTypes.STRING(5),
      allowNull: false
    },
    partner_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: {
        model: 'Partner',
        key: 'partner_id'
      }
    }
  }, {
    sequelize,
    tableName: 'BankAccount',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "BankAccount_pkey",
        unique: true,
        fields: [
          { name: "bank_account_id" },
        ]
      },
    ]
  });
  }
}
