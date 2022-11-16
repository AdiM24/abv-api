import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { PartnerBankAccountMap, PartnerBankAccountMapId } from './PartnerBankAccountMap';

export interface BankAccountAttributes {
  bank_account_id: number;
  iban: string;
  bank_name: string;
  currency: string;
}

export type BankAccountPk = "bank_account_id";
export type BankAccountId = BankAccount[BankAccountPk];
export type BankAccountOptionalAttributes = "bank_account_id";
export type BankAccountCreationAttributes = Optional<BankAccountAttributes, BankAccountOptionalAttributes>;

export class BankAccount extends Model<BankAccountAttributes, BankAccountCreationAttributes> implements BankAccountAttributes {
  bank_account_id!: number;
  iban!: string;
  bank_name!: string;
  currency!: string;

  // BankAccount hasMany PartnerBankAccountMap via bank_account_id
  PartnerBankAccountMaps!: PartnerBankAccountMap[];
  getPartnerBankAccountMaps!: Sequelize.HasManyGetAssociationsMixin<PartnerBankAccountMap>;
  setPartnerBankAccountMaps!: Sequelize.HasManySetAssociationsMixin<PartnerBankAccountMap, PartnerBankAccountMapId>;
  addPartnerBankAccountMap!: Sequelize.HasManyAddAssociationMixin<PartnerBankAccountMap, PartnerBankAccountMapId>;
  addPartnerBankAccountMaps!: Sequelize.HasManyAddAssociationsMixin<PartnerBankAccountMap, PartnerBankAccountMapId>;
  createPartnerBankAccountMap!: Sequelize.HasManyCreateAssociationMixin<PartnerBankAccountMap>;
  removePartnerBankAccountMap!: Sequelize.HasManyRemoveAssociationMixin<PartnerBankAccountMap, PartnerBankAccountMapId>;
  removePartnerBankAccountMaps!: Sequelize.HasManyRemoveAssociationsMixin<PartnerBankAccountMap, PartnerBankAccountMapId>;
  hasPartnerBankAccountMap!: Sequelize.HasManyHasAssociationMixin<PartnerBankAccountMap, PartnerBankAccountMapId>;
  hasPartnerBankAccountMaps!: Sequelize.HasManyHasAssociationsMixin<PartnerBankAccountMap, PartnerBankAccountMapId>;
  countPartnerBankAccountMaps!: Sequelize.HasManyCountAssociationsMixin;

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
