import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { Address, AddressId } from './Address';
import type { Partner, PartnerId } from './Partner';

export interface PartnerAddressMapAttributes {
  partner_address_map_id: number;
  partner_id?: number;
  address_id?: number;
}

export type PartnerAddressMapPk = "partner_address_map_id";
export type PartnerAddressMapId = PartnerAddressMap[PartnerAddressMapPk];
export type PartnerAddressMapOptionalAttributes = "partner_address_map_id" | "partner_id" | "address_id";
export type PartnerAddressMapCreationAttributes = Optional<PartnerAddressMapAttributes, PartnerAddressMapOptionalAttributes>;

export class PartnerAddressMap extends Model<PartnerAddressMapAttributes, PartnerAddressMapCreationAttributes> implements PartnerAddressMapAttributes {
  partner_address_map_id!: number;
  partner_id?: number;
  address_id?: number;

  // PartnerAddressMap belongsTo Address via address_id
  address!: Address;
  getAddress!: Sequelize.BelongsToGetAssociationMixin<Address>;
  setAddress!: Sequelize.BelongsToSetAssociationMixin<Address, AddressId>;
  createAddress!: Sequelize.BelongsToCreateAssociationMixin<Address>;
  // PartnerAddressMap belongsTo Partner via partner_id
  partner!: Partner;
  getPartner!: Sequelize.BelongsToGetAssociationMixin<Partner>;
  setPartner!: Sequelize.BelongsToSetAssociationMixin<Partner, PartnerId>;
  createPartner!: Sequelize.BelongsToCreateAssociationMixin<Partner>;

  static initModel(sequelize: Sequelize.Sequelize): typeof PartnerAddressMap {
    return PartnerAddressMap.init({
    partner_address_map_id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    partner_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: {
        model: 'Partner',
        key: 'partner_id'
      }
    },
    address_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: {
        model: 'Address',
        key: 'address_id'
      }
    }
  }, {
    sequelize,
    tableName: 'PartnerAddressMap',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "PartnerAddressMap_pkey",
        unique: true,
        fields: [
          { name: "partner_address_map_id" },
        ]
      },
    ]
  });
  }
}
