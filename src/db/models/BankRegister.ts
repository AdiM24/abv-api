import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { Partner, PartnerId } from './Partner';

export interface BankRegisterAttributes {
  bank_register_id: number;
  iban: string;
  balance: number;
  partner_id: number;
  currency: "EUR" | "RON";
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
  currency!: "EUR" | "RON";

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
      type: DataTypes.ENUM("EUR","RON"),
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
