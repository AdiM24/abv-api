import * as Sequelize from 'sequelize';
import {DataTypes, Model, Optional} from 'sequelize';
import type {Invoice, InvoiceId} from './Invoice';
import type {OrderDetails, OrderDetailsId} from './OrderDetails';
import type {Partner, PartnerId} from './Partner';
import type {User, UserId} from './User';

export interface OrderAttributes {
  order_id: number;
  client_id: number;
  transporter_id: number;
  buyer_id: number;
  series: string;
  number: number;
  driver_info?: string;
  car_reg_number?: string;
  package_info?: string;
  remarks_transporter?: string;
  remarks_buyer?: string;
  client_price: number;
  client_currency: "RON" | "EUR";
  transporter_price: number;
  transporter_currency: "RON" | "EUR";
  user_id: number;
  created_at_utc: Date;
  client_contact?: string;
  transporter_contact?: string;
  transporter_vat?: number;
  client_vat?: number;
  invoice_generated: boolean;
  profit?: number;
  profit_currency: "RON" | "EUR";
}

export type OrderPk = "order_id";
export type OrderId = Order[OrderPk];
export type OrderOptionalAttributes =
  "order_id"
  | "driver_info"
  | "car_reg_number"
  | "package_info"
  | "remarks_transporter"
  | "remarks_buyer"
  | "created_at_utc"
  | "client_contact"
  | "transporter_contact"
  | "transporter_vat"
  | "client_vat";
export type OrderCreationAttributes = Optional<OrderAttributes, OrderOptionalAttributes>;

export class Order extends Model<OrderAttributes, OrderCreationAttributes> implements OrderAttributes {
  order_id!: number;
  client_id!: number;
  transporter_id!: number;
  buyer_id!: number;
  series!: string;
  number!: number;
  driver_info?: string;
  car_reg_number?: string;
  package_info?: string;
  remarks_transporter?: string;
  remarks_buyer?: string;
  client_price!: number;
  client_currency!: "RON" | "EUR";
  transporter_price!: number;
  transporter_currency!: "RON" | "EUR";
  user_id!: number;
  created_at_utc!: Date;
  client_contact?: string;
  transporter_contact?: string;
  transporter_vat?: number;
  client_vat?: number;
  invoice_generated!: boolean;
  profit?: number;
  profit_currency: "RON" | "EUR";

  // Order hasMany Invoice via order_reference_id
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
  // Order hasMany OrderDetails via order_id
  OrderDetails!: OrderDetails[];
  getOrderDetails!: Sequelize.HasManyGetAssociationsMixin<OrderDetails>;
  setOrderDetails!: Sequelize.HasManySetAssociationsMixin<OrderDetails, OrderDetailsId>;
  addOrderDetail!: Sequelize.HasManyAddAssociationMixin<OrderDetails, OrderDetailsId>;
  addOrderDetails!: Sequelize.HasManyAddAssociationsMixin<OrderDetails, OrderDetailsId>;
  createOrderDetail!: Sequelize.HasManyCreateAssociationMixin<OrderDetails>;
  removeOrderDetail!: Sequelize.HasManyRemoveAssociationMixin<OrderDetails, OrderDetailsId>;
  removeOrderDetails!: Sequelize.HasManyRemoveAssociationsMixin<OrderDetails, OrderDetailsId>;
  hasOrderDetail!: Sequelize.HasManyHasAssociationMixin<OrderDetails, OrderDetailsId>;
  hasOrderDetails!: Sequelize.HasManyHasAssociationsMixin<OrderDetails, OrderDetailsId>;
  countOrderDetails!: Sequelize.HasManyCountAssociationsMixin;
  // Order belongsTo Partner via buyer_id
  buyer!: Partner;
  getBuyer!: Sequelize.BelongsToGetAssociationMixin<Partner>;
  setBuyer!: Sequelize.BelongsToSetAssociationMixin<Partner, PartnerId>;
  createBuyer!: Sequelize.BelongsToCreateAssociationMixin<Partner>;
  // Order belongsTo Partner via client_id
  client!: Partner;
  getClient!: Sequelize.BelongsToGetAssociationMixin<Partner>;
  setClient!: Sequelize.BelongsToSetAssociationMixin<Partner, PartnerId>;
  createClient!: Sequelize.BelongsToCreateAssociationMixin<Partner>;
  // Order belongsTo Partner via transporter_id
  transporter!: Partner;
  getTransporter!: Sequelize.BelongsToGetAssociationMixin<Partner>;
  setTransporter!: Sequelize.BelongsToSetAssociationMixin<Partner, PartnerId>;
  createTransporter!: Sequelize.BelongsToCreateAssociationMixin<Partner>;
  // Order belongsTo User via user_id
  user!: User;
  getUser!: Sequelize.BelongsToGetAssociationMixin<User>;
  setUser!: Sequelize.BelongsToSetAssociationMixin<User, UserId>;
  createUser!: Sequelize.BelongsToCreateAssociationMixin<User>;

  static initModel(sequelize: Sequelize.Sequelize): typeof Order {
    return Order.init({
      order_id: {
        autoIncrement: true,
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true
      },
      client_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
          model: 'Partner',
          key: 'partner_id'
        }
      },
      transporter_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
          model: 'Partner',
          key: 'partner_id'
        }
      },
      buyer_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
          model: 'Partner',
          key: 'partner_id'
        }
      },
      series: {
        type: DataTypes.STRING,
        allowNull: false
      },
      number: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      driver_info: {
        type: DataTypes.STRING,
        allowNull: true
      },
      car_reg_number: {
        type: DataTypes.STRING,
        allowNull: true
      },
      package_info: {
        type: DataTypes.STRING,
        allowNull: true
      },
      remarks_transporter: {
        type: DataTypes.STRING,
        allowNull: true
      },
      remarks_buyer: {
        type: DataTypes.STRING,
        allowNull: true
      },
      client_price: {
        type: DataTypes.DECIMAL,
        allowNull: false
      },
      client_currency: {
        type: DataTypes.ENUM("RON", "EUR"),
        allowNull: false
      },
      transporter_price: {
        type: DataTypes.DECIMAL,
        allowNull: false
      },
      transporter_currency: {
        type: DataTypes.ENUM("RON", "EUR"),
        allowNull: false
      },
      user_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
          model: 'User',
          key: 'user_id'
        }
      },
      created_at_utc: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.Sequelize.fn('now')
      },
      client_contact: {
        type: DataTypes.STRING,
        allowNull: true
      },
      transporter_contact: {
        type: DataTypes.STRING,
        allowNull: true
      },
      transporter_vat: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 19
      },
      client_vat: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 19
      },
      profit: {
        type: DataTypes.DECIMAL,
        allowNull: false,
        defaultValue: 0
      },
      invoice_generated: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      profit_currency: {
        type: DataTypes.ENUM("RON", "EUR"),
        allowNull: false,
        defaultValue: "RON"
      }
    }, {
      sequelize,
      tableName: 'Order',
      schema: 'public',
      timestamps: false,
      indexes: [
        {
          name: "Order_pk",
          unique: true,
          fields: [
            {name: "order_id"},
          ]
        },
      ]
    });
  }
}
