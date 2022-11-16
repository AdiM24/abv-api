import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { BankAccount, BankAccountId } from './BankAccount';
import type { Partner, PartnerId } from './Partner';

export interface PartnerBankAccountMapAttributes {
  partner_bank_account_map_id: number;
  partner_id: number;
  bank_account_id: number;
}

export type PartnerBankAccountMapPk = "partner_bank_account_map_id";
export type PartnerBankAccountMapId = PartnerBankAccountMap[PartnerBankAccountMapPk];
export type PartnerBankAccountMapOptionalAttributes = "partner_bank_account_map_id";
export type PartnerBankAccountMapCreationAttributes = Optional<PartnerBankAccountMapAttributes, PartnerBankAccountMapOptionalAttributes>;

export class PartnerBankAccountMap extends Model<PartnerBankAccountMapAttributes, PartnerBankAccountMapCreationAttributes> implements PartnerBankAccountMapAttributes {
  partner_bank_account_map_id!: number;
  partner_id!: number;
  bank_account_id!: number;

  // PartnerBankAccountMap belongsTo BankAccount via bank_account_id
  bank_account!: BankAccount;
  getBank_account!: Sequelize.BelongsToGetAssociationMixin<BankAccount>;
  setBank_account!: Sequelize.BelongsToSetAssociationMixin<BankAccount, BankAccountId>;
  createBank_account!: Sequelize.BelongsToCreateAssociationMixin<BankAccount>;
  // PartnerBankAccountMap belongsTo Partner via partner_id
  partner!: Partner;
  getPartner!: Sequelize.BelongsToGetAssociationMixin<Partner>;
  setPartner!: Sequelize.BelongsToSetAssociationMixin<Partner, PartnerId>;
  createPartner!: Sequelize.BelongsToCreateAssociationMixin<Partner>;

  static initModel(sequelize: Sequelize.Sequelize): typeof PartnerBankAccountMap {
    return PartnerBankAccountMap.init({
    partner_bank_account_map_id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    partner_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'Partner',
        key: 'partner_id'
      }
    },
    bank_account_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'BankAccount',
        key: 'bank_account_id'
      }
    }
  }, {
    sequelize,
    tableName: 'PartnerBankAccountMap',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "partner_bank_account_map_pk",
        unique: true,
        fields: [
          { name: "partner_bank_account_map_id" },
        ]
      },
    ]
  });
  }
}
