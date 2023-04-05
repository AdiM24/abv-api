import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { Order, OrderId } from './Order';
import type { OrderGoods, OrderGoodsId } from './OrderGoods';

export interface OrderDetailsAttributes {
  order_details_id: number;
  order_id: number;
  location?: string;
  date_from: Date;
  date_to: Date;
  remarks?: string;
  type: "PICKUP" | "DROPOFF";
}

export type OrderDetailsPk = "order_details_id";
export type OrderDetailsId = OrderDetails[OrderDetailsPk];
export type OrderDetailsOptionalAttributes = "order_details_id" | "location" | "date_from" | "date_to" | "remarks";
export type OrderDetailsCreationAttributes = Optional<OrderDetailsAttributes, OrderDetailsOptionalAttributes>;

export class OrderDetails extends Model<OrderDetailsAttributes, OrderDetailsCreationAttributes> implements OrderDetailsAttributes {
  order_details_id!: number;
  order_id!: number;
  location?: string;
  date_from!: Date;
  date_to!: Date;
  remarks?: string;
  type!: "PICKUP" | "DROPOFF";

  // OrderDetails belongsTo Order via order_id
  order!: Order;
  getOrder!: Sequelize.BelongsToGetAssociationMixin<Order>;
  setOrder!: Sequelize.BelongsToSetAssociationMixin<Order, OrderId>;
  createOrder!: Sequelize.BelongsToCreateAssociationMixin<Order>;
  // OrderDetails hasMany OrderGoods via order_details_id
  OrderGoods!: OrderGoods[];
  getOrderGoods!: Sequelize.HasManyGetAssociationsMixin<OrderGoods>;
  setOrderGoods!: Sequelize.HasManySetAssociationsMixin<OrderGoods, OrderGoodsId>;
  addOrderGood!: Sequelize.HasManyAddAssociationMixin<OrderGoods, OrderGoodsId>;
  addOrderGoods!: Sequelize.HasManyAddAssociationsMixin<OrderGoods, OrderGoodsId>;
  createOrderGood!: Sequelize.HasManyCreateAssociationMixin<OrderGoods>;
  removeOrderGood!: Sequelize.HasManyRemoveAssociationMixin<OrderGoods, OrderGoodsId>;
  removeOrderGoods!: Sequelize.HasManyRemoveAssociationsMixin<OrderGoods, OrderGoodsId>;
  hasOrderGood!: Sequelize.HasManyHasAssociationMixin<OrderGoods, OrderGoodsId>;
  hasOrderGoods!: Sequelize.HasManyHasAssociationsMixin<OrderGoods, OrderGoodsId>;
  countOrderGoods!: Sequelize.HasManyCountAssociationsMixin;

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
    location: {
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
