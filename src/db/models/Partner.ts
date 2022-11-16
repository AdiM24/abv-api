import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { Contact, ContactId } from './Contact';
import type { PartnerAddressMap, PartnerAddressMapId } from './PartnerAddressMap';
import type { PartnerBankAccountMap, PartnerBankAccountMapId } from './PartnerBankAccountMap';

export interface PartnerAttributes {
  partner_id: number;
  name: string;
  unique_identification_number: string;
  trade_register_registration_number: string;
  contact_id?: number;
  credit: number;
  remaining_credit: number;
  vat_payer: boolean;
  vat_split: boolean;
  vat_collection: boolean;
  invoice_deadline_days?: number;
  credit_exceedance_percentage?: number;
  created_at_utc: Date;
  modified_at_utc: Date;
}

export type PartnerPk = "partner_id";
export type PartnerId = Partner[PartnerPk];
export type PartnerOptionalAttributes = "partner_id" | "contact_id" | "credit" | "remaining_credit" | "invoice_deadline_days" | "credit_exceedance_percentage" | "created_at_utc" | "modified_at_utc";
export type PartnerCreationAttributes = Optional<PartnerAttributes, PartnerOptionalAttributes>;

export class Partner extends Model<PartnerAttributes, PartnerCreationAttributes> implements PartnerAttributes {
  partner_id!: number;
  name!: string;
  unique_identification_number!: string;
  trade_register_registration_number!: string;
  contact_id?: number;
  credit!: number;
  remaining_credit!: number;
  vat_payer!: boolean;
  vat_split!: boolean;
  vat_collection!: boolean;
  invoice_deadline_days?: number;
  credit_exceedance_percentage?: number;
  created_at_utc!: Date;
  modified_at_utc!: Date;

  // Partner belongsTo Contact via contact_id
  contact!: Contact;
  getContact!: Sequelize.BelongsToGetAssociationMixin<Contact>;
  setContact!: Sequelize.BelongsToSetAssociationMixin<Contact, ContactId>;
  createContact!: Sequelize.BelongsToCreateAssociationMixin<Contact>;
  // Partner hasMany PartnerAddressMap via partner_id
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
  // Partner hasMany PartnerBankAccountMap via partner_id
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

  static initModel(sequelize: Sequelize.Sequelize): typeof Partner {
    return Partner.init({
    partner_id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    unique_identification_number: {
      type: DataTypes.STRING,
      allowNull: false
    },
    trade_register_registration_number: {
      type: DataTypes.STRING,
      allowNull: false
    },
    contact_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: {
        model: 'Contact',
        key: 'contact_id'
      }
    },
    credit: {
      type: DataTypes.DECIMAL(19,4),
      allowNull: false,
      defaultValue: 0
    },
    remaining_credit: {
      type: DataTypes.DECIMAL(19,4),
      allowNull: false,
      defaultValue: 0
    },
    vat_payer: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    vat_split: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    vat_collection: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    invoice_deadline_days: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    credit_exceedance_percentage: {
      type: DataTypes.DECIMAL,
      allowNull: true
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
    tableName: 'Partner',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "Partner_pkey",
        unique: true,
        fields: [
          { name: "partner_id" },
        ]
      },
    ]
  });
  }
}
