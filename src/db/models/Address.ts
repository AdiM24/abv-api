import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { Invoice, InvoiceId } from './Invoice';
import type { Partner, PartnerId } from './Partner';

export interface AddressAttributes {
  address_id: number;
  county?: string;
  country?: string;
  city?: string;
  address?: string;
  partner_id?: number;
  nickname?: string;
}

export type AddressPk = "address_id";
export type AddressId = Address[AddressPk];
export type AddressOptionalAttributes = "address_id" | "county" | "country" | "city" | "address" | "partner_id" | "nickname";
export type AddressCreationAttributes = Optional<AddressAttributes, AddressOptionalAttributes>;

export class Address extends Model<AddressAttributes, AddressCreationAttributes> implements AddressAttributes {
  address_id!: number;
  county?: string;
  country?: string;
  city?: string;
  address?: string;
  partner_id?: number;
  nickname?: string;

  // Address hasMany Invoice via drop_off_address_id
  Invoices!: Invoice[];
  getInvoices!: Sequelize.HasManyGetAssociationsMixin<Invoice>;
  setInvoices!: Sequelize.HasManySetAssociationsMixin<Invoice, InvoiceId>;
  addInvoice!: Sequelize.HasManyAddAssociationMixin<Invoice, InvoiceId>;
  addInvoices!: Sequelize.HasManyAddAssociationsMixin<Invoice, InvoiceId>;
  createInvoice!: Sequelize.HasManyCreateAssociationMixin<Invoice>;
  removeInvoice!: Sequelize.HasManyRemoveAssociationMixin<Invoice, InvoiceId>;
  removeInvoices!: Sequelize.HasManyRemoveAssociationsMixin<Invoice, InvoiceId>;
  hasInvoice!: Sequelize.HasManyHasAssociationMixin<Invoice, InvoiceId>;
  hasInvoices!: Sequelize.HasManyHasAssociationsMixin<Invoice, InvoiceId>;
  countInvoices!: Sequelize.HasManyCountAssociationsMixin;
  // Address hasMany Invoice via pickup_address_id
  pickup_address_Invoices!: Invoice[];
  getPickup_address_Invoices!: Sequelize.HasManyGetAssociationsMixin<Invoice>;
  setPickup_address_Invoices!: Sequelize.HasManySetAssociationsMixin<Invoice, InvoiceId>;
  addPickup_address_Invoice!: Sequelize.HasManyAddAssociationMixin<Invoice, InvoiceId>;
  addPickup_address_Invoices!: Sequelize.HasManyAddAssociationsMixin<Invoice, InvoiceId>;
  createPickup_address_Invoice!: Sequelize.HasManyCreateAssociationMixin<Invoice>;
  removePickup_address_Invoice!: Sequelize.HasManyRemoveAssociationMixin<Invoice, InvoiceId>;
  removePickup_address_Invoices!: Sequelize.HasManyRemoveAssociationsMixin<Invoice, InvoiceId>;
  hasPickup_address_Invoice!: Sequelize.HasManyHasAssociationMixin<Invoice, InvoiceId>;
  hasPickup_address_Invoices!: Sequelize.HasManyHasAssociationsMixin<Invoice, InvoiceId>;
  countPickup_address_Invoices!: Sequelize.HasManyCountAssociationsMixin;
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
      allowNull: true
    },
    country: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    city: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    address: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    partner_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: {
        model: 'Partner',
        key: 'partner_id'
      }
    },
    nickname: {
      type: DataTypes.STRING,
      allowNull: true
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
