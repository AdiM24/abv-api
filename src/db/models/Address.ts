import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { PartnerAddressMap, PartnerAddressMapId } from './PartnerAddressMap';

export interface AddressAttributes {
  address_id: number;
  county: string;
  country: string;
  city: string;
  address: string;
  created_at_utc: Date;
  modified_at_utc: Date;
}

export type AddressPk = "address_id";
export type AddressId = Address[AddressPk];
export type AddressOptionalAttributes = "address_id" | "created_at_utc" | "modified_at_utc";
export type AddressCreationAttributes = Optional<AddressAttributes, AddressOptionalAttributes>;

export class Address extends Model<AddressAttributes, AddressCreationAttributes> implements AddressAttributes {
  address_id!: number;
  county!: string;
  country!: string;
  city!: string;
  address!: string;
  created_at_utc!: Date;
  modified_at_utc!: Date;

  // Address hasMany PartnerAddressMap via address_id
  PartnerAddressMaps!: PartnerAddressMap[];
  getPartnerAddressMaps!: Sequelize.HasManyGetAssociationsMixin<PartnerAddressMap>;
  setPartnerAddressMaps!: Sequelize.HasManySetAssociationsMixin<PartnerAddressMap, PartnerAddressMapId>;
  addPartnerAddressMap!: Sequelize.HasManyAddAssociationMixin<PartnerAddressMap, PartnerAddressMapId>;
  addPartnerAddressMaps!: Sequelize.HasManyAddAssociationsMixin<PartnerAddressMap, PartnerAddressMapId>;
  createPartnerAddressMap!: Sequelize.HasManyCreateAssociationMixin<PartnerAddressMap>;
  removePartnerAddressMap!: Sequelize.HasManyRemoveAssociationMixin<PartnerAddressMap, PartnerAddressMapId>;
  removePartnerAddressMaps!: Sequelize.HasManyRemoveAssociationsMixin<PartnerAddressMap, PartnerAddressMapId>;
  hasPartnerAddressMap!: Sequelize.HasManyHasAssociationMixin<PartnerAddressMap, PartnerAddressMapId>;
  hasPartnerAddressMaps!: Sequelize.HasManyHasAssociationsMixin<PartnerAddressMap, PartnerAddressMapId>;
  countPartnerAddressMaps!: Sequelize.HasManyCountAssociationsMixin;

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
    created_at_utc: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.literal('(now() AT TIME ZONE utc')
    },
    modified_at_utc: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.literal('(now() AT TIME ZONE utc')
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
