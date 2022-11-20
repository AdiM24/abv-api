import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { Partner, PartnerId } from './Partner';

export interface AddressAttributes {
  address_id: number;
  county: string;
  country: string;
  city: string;
  address: string;
  partner_id?: number;
}

export type AddressPk = "address_id";
export type AddressId = Address[AddressPk];
export type AddressOptionalAttributes = "address_id" | "partner_id";
export type AddressCreationAttributes = Optional<AddressAttributes, AddressOptionalAttributes>;

export class Address extends Model<AddressAttributes, AddressCreationAttributes> implements AddressAttributes {
  address_id!: number;
  county!: string;
  country!: string;
  city!: string;
  address!: string;
  partner_id?: number;

  // Address belongsTo Partner via partner_id
  partner!: Partner;
  getPartner!: Sequelize.BelongsToGetAssociationMixin<Partner>;
  setPartner!: Sequelize.BelongsToSetAssociationMixin<Partner, PartnerId>;
  createPartner!: Sequelize.BelongsToCreateAssociationMixin<Partner>;

  static initModel(sequelize: Sequelize.Sequelize): typeof Address {
    return Address.init({
    address_id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    county: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    country: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    city: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    address: {
      type: DataTypes.STRING(250),
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
    tableName: 'Address',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "Address_pkey",
        unique: true,
        fields: [
          { name: "address_id" },
        ]
      },
    ]
  });
  }
}
