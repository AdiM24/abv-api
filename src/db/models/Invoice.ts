import * as Sequelize from 'sequelize';
import {DataTypes, Model, Optional} from 'sequelize';
import type {Address, AddressId} from './Address';
import type {InvoiceProduct, InvoiceProductId} from './InvoiceProduct';
import type {Order, OrderId} from './Order';
import type {Partner, PartnerId} from './Partner';
import type {Receipt, ReceiptId} from './Receipt';
import type {User, UserId} from './User';

export interface InvoiceAttributes {
  invoice_id: number;
  client_id?: number;
  buyer_id?: number;
  deadline_at_utc?: string;
  created_at_utc?: string;
  status: "paid" | "overdue" | "incomplete payment" | "unpaid";
  type: "proforma" | "issued" | "received" | "notice" | "order" | "receipt";
  number: number;
  series: string;
  sent_status?: "sent" | "not sent";
  total_price?: number;
  total_vat?: number;
  total_price_incl_vat?: number;
  pickup_address_id?: number;
  drop_off_address_id?: number;
  driver_info?: string;
  car_reg_number?: string;
  currency?: "RON" | "EUR";
  total_paid_price: number;
  user_id: number;
  order_reference_id?: number;
  notice_status: "Complet" | "Incomplet";
  e_transport_generated: boolean;
  driver_name: string;
}

export type InvoicePk = "invoice_id";
export type InvoiceId = Invoice[InvoicePk];
export type InvoiceOptionalAttributes =
  "invoice_id"
  | "client_id"
  | "buyer_id"
  | "deadline_at_utc"
  | "created_at_utc"
  | "sent_status"
  | "total_price"
  | "total_vat"
  | "total_price_incl_vat"
  | "pickup_address_id"
  | "drop_off_address_id"
  | "driver_info"
  | "car_reg_number"
  | "currency"
  | "total_paid_price"
  | "order_reference_id"
  | "notice_status"
  | "driver_name";
export type InvoiceCreationAttributes = Optional<InvoiceAttributes, InvoiceOptionalAttributes>;

export class Invoice extends Model<InvoiceAttributes, InvoiceCreationAttributes> implements InvoiceAttributes {
  invoice_id!: number;
  client_id?: number;
  buyer_id?: number;
  deadline_at_utc?: string;
  created_at_utc?: string;
  status!: "paid" | "overdue" | "incomplete payment" | "unpaid";
  type!: "proforma" | "issued" | "received" | "notice" | "order" | "receipt";
  number!: number;
  series!: string;
  sent_status?: "sent" | "not sent";
  total_price?: number;
  total_vat?: number;
  total_price_incl_vat?: number;
  pickup_address_id?: number;
  drop_off_address_id?: number;
  driver_info?: string;
  car_reg_number?: string;
  currency?: "RON" | "EUR";
  total_paid_price!: number;
  user_id!: number;
  order_reference_id?: number;
  notice_status!: "Complet" | "Incomplet";
  e_transport_generated!: boolean;
  driver_name: string;

  // Invoice belongsTo Address via drop_off_address_id
  drop_off_address!: Address;
  getDrop_off_address!: Sequelize.BelongsToGetAssociationMixin<Address>;
  setDrop_off_address!: Sequelize.BelongsToSetAssociationMixin<Address, AddressId>;
  createDrop_off_address!: Sequelize.BelongsToCreateAssociationMixin<Address>;
  // Invoice belongsTo Address via pickup_address_id
  pickup_address!: Address;
  getPickup_address!: Sequelize.BelongsToGetAssociationMixin<Address>;
  setPickup_address!: Sequelize.BelongsToSetAssociationMixin<Address, AddressId>;
  createPickup_address!: Sequelize.BelongsToCreateAssociationMixin<Address>;
  // Invoice hasMany InvoiceProduct via invoice_id
  InvoiceProducts!: InvoiceProduct[];
  getInvoiceProducts!: Sequelize.HasManyGetAssociationsMixin<InvoiceProduct>;
  setInvoiceProducts!: Sequelize.HasManySetAssociationsMixin<InvoiceProduct, InvoiceProductId>;
  addInvoiceProduct!: Sequelize.HasManyAddAssociationMixin<InvoiceProduct, InvoiceProductId>;
  addInvoiceProducts!: Sequelize.HasManyAddAssociationsMixin<InvoiceProduct, InvoiceProductId>;
  createInvoiceProduct!: Sequelize.HasManyCreateAssociationMixin<InvoiceProduct>;
  removeInvoiceProduct!: Sequelize.HasManyRemoveAssociationMixin<InvoiceProduct, InvoiceProductId>;
  removeInvoiceProducts!: Sequelize.HasManyRemoveAssociationsMixin<InvoiceProduct, InvoiceProductId>;
  hasInvoiceProduct!: Sequelize.HasManyHasAssociationMixin<InvoiceProduct, InvoiceProductId>;
  hasInvoiceProducts!: Sequelize.HasManyHasAssociationsMixin<InvoiceProduct, InvoiceProductId>;
  countInvoiceProducts!: Sequelize.HasManyCountAssociationsMixin;
  // Invoice hasMany Receipt via invoice_id
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
  // Invoice belongsTo Order via order_reference_id
  order_reference!: Order;
  getOrder_reference!: Sequelize.BelongsToGetAssociationMixin<Order>;
  setOrder_reference!: Sequelize.BelongsToSetAssociationMixin<Order, OrderId>;
  createOrder_reference!: Sequelize.BelongsToCreateAssociationMixin<Order>;
  // Invoice belongsTo Partner via buyer_id
  buyer!: Partner;
  getBuyer!: Sequelize.BelongsToGetAssociationMixin<Partner>;
  setBuyer!: Sequelize.BelongsToSetAssociationMixin<Partner, PartnerId>;
  createBuyer!: Sequelize.BelongsToCreateAssociationMixin<Partner>;
  // Invoice belongsTo Partner via client_id
  client!: Partner;
  getClient!: Sequelize.BelongsToGetAssociationMixin<Partner>;
  setClient!: Sequelize.BelongsToSetAssociationMixin<Partner, PartnerId>;
  createClient!: Sequelize.BelongsToCreateAssociationMixin<Partner>;
  // Invoice belongsTo User via user_id
  user!: User;
  getUser!: Sequelize.BelongsToGetAssociationMixin<User>;
  setUser!: Sequelize.BelongsToSetAssociationMixin<User, UserId>;
  createUser!: Sequelize.BelongsToCreateAssociationMixin<User>;

  static initModel(sequelize: Sequelize.Sequelize): typeof Invoice {
    return Invoice.init({
      invoice_id: {
        autoIncrement: true,
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true
      },
      client_id: {
        type: DataTypes.BIGINT,
        allowNull: true,
        references: {
          model: 'Partner',
          key: 'partner_id'
        }
      },
      buyer_id: {
        type: DataTypes.BIGINT,
        allowNull: true,
        references: {
          model: 'Partner',
          key: 'partner_id'
        }
      },
      deadline_at_utc: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        defaultValue: Sequelize.Sequelize.literal("(now() AT TIME ZONE 'utc'::text)")
      },
      created_at_utc: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        defaultValue: Sequelize.Sequelize.literal("(now() AT TIME ZONE 'utc'::text)")
      },
      status: {
        type: DataTypes.ENUM("paid", "overdue", "incomplete payment", "unpaid"),
        allowNull: false
      },
      type: {
        type: DataTypes.ENUM("proforma", "issued", "received", "notice", "order", "receipt"),
        allowNull: false
      },
      number: {
        type: DataTypes.BIGINT,
        allowNull: false
      },
      series: {
        type: DataTypes.STRING,
        allowNull: false
      },
      sent_status: {
        type: DataTypes.ENUM("sent", "not sent"),
        allowNull: true
      },
      total_price: {
        type: DataTypes.DECIMAL,
        allowNull: true,
        defaultValue: 0
      },
      total_vat: {
        type: DataTypes.DECIMAL,
        allowNull: true,
        defaultValue: 0
      },
      total_price_incl_vat: {
        type: DataTypes.DECIMAL,
        allowNull: true,
        defaultValue: 0
      },
      pickup_address_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'Address',
          key: 'address_id'
        }
      },
      drop_off_address_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'Address',
          key: 'address_id'
        }
      },
      driver_info: {
        type: DataTypes.STRING,
        allowNull: true
      },
      driver_name: {
        type: DataTypes.STRING,
        allowNull: true
      },
      car_reg_number: {
        type: DataTypes.STRING,
        allowNull: true
      },
      currency: {
        type: DataTypes.ENUM("RON", "EUR"),
        allowNull: true
      },
      total_paid_price: {
        type: DataTypes.DECIMAL,
        allowNull: false,
        defaultValue: 0
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'User',
          key: 'user_id'
        }
      },
      order_reference_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'Order',
          key: 'order_id'
        }
      },
      notice_status: {
        type: DataTypes.ENUM("Complet", "Incomplet"),
        allowNull: false,
        defaultValue: "Incomplet"
      },
      e_transport_generated: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      }
    }, {
      sequelize,
      tableName: 'Invoice',
      schema: 'public',
      timestamps: false,
      indexes: [
        {
          name: "Invoice_pk",
          unique: true,
          fields: [
            {name: "invoice_id"},
          ]
        },
      ]
    });
  }
}
