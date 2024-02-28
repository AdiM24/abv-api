import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { Order, OrderId } from './Order';

export interface OrderDetailsAttributes {
  order_details_id: number;
  order_id: number;
  company?: string;
  date_from: Date;
  date_to: Date;
  remarks?: string;
  type: "PICKUP" | "DROPOFF";
  address?: string;
  location?: string;
  reference?: string;
  county: string;
  city: string
}

export type OrderDetailsPk = "order_details_id";
export type OrderDetailsId = OrderDetails[OrderDetailsPk];
export type OrderDetailsOptionalAttributes = "order_details_id" | "company" | "date_from" | "date_to" | "remarks" | "address" | "location" | "reference";
export type OrderDetailsCreationAttributes = Optional<OrderDetailsAttributes, OrderDetailsOptionalAttributes>;

export class OrderDetails extends Model<OrderDetailsAttributes, OrderDetailsCreationAttributes> implements OrderDetailsAttributes {
  order_details_id!: number;
  order_id!: number;
  company?: string;
  date_from!: Date;
  date_to!: Date;
  remarks?: string;
  type!: "PICKUP" | "DROPOFF";
  address?: string;
  location?: string;
  reference?: string;
  county: string;
  city: string;

  // OrderDetails belongsTo Order via order_id
  order!: Order;
  getOrder!: Sequelize.BelongsToGetAssociationMixin<Order>;
  setOrder!: Sequelize.BelongsToSetAssociationMixin<Order, OrderId>;
  createOrder!: Sequelize.BelongsToCreateAssociationMixin<Order>;

  static initModel(sequelize: Sequelize.Sequelize): typeof OrderDetails {
    return OrderDetails.init({
    order_details_id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    order_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'Order',
        key: 'order_id'
      }
    },
    company: {
      type: DataTypes.STRING,
      allowNull: true
    },
    date_from: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.fn('now')
    },
    date_to: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.fn('now')
    },
    remarks: {
      type: DataTypes.STRING,
      allowNull: true
    },
    type: {
      type: DataTypes.ENUM("PICKUP","DROPOFF"),
      allowNull: false
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true
    },
    location: {
      type: DataTypes.STRING,
      allowNull: true
    },
    reference: {
      type: DataTypes.STRING,
      allowNull: true
    },
      county: {
      type: DataTypes.STRING,
        allowNull: false
      },
      city: {
      type: DataTypes.STRING,
        allowNull: false
      }
  }, {
    sequelize,
    tableName: 'OrderDetails',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "OrderDetails_pk",
        unique: true,
        fields: [
          { name: "order_details_id" },
        ]
      },
    ]
  });
  }
}
