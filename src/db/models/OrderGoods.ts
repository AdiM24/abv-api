import * as Sequelize from 'sequelize';
import {DataTypes, Model, Optional} from 'sequelize';
import type {OrderDetails, OrderDetailsId} from './OrderDetails';

export interface OrderGoodsAttributes {
  order_goods_id: number;
  name: string;
  quantity: number;
  weight?: number;
  order_details_id: number;
  unit_of_measure?: string;
}

export type OrderGoodsPk = "order_goods_id";
export type OrderGoodsId = OrderGoods[OrderGoodsPk];
export type OrderGoodsOptionalAttributes = "order_goods_id" | "weight";
export type OrderGoodsCreationAttributes = Optional<OrderGoodsAttributes, OrderGoodsOptionalAttributes>;

export class OrderGoods extends Model<OrderGoodsAttributes, OrderGoodsCreationAttributes> implements OrderGoodsAttributes {
  order_goods_id!: number;
  name!: string;
  quantity!: number;
  weight?: number;
  order_details_id!: number;
  unit_of_measure?: string;
  // OrderGoods belongsTo OrderDetails via order_details_id
  order_detail!: OrderDetails;
  getOrder_detail!: Sequelize.BelongsToGetAssociationMixin<OrderDetails>;
  setOrder_detail!: Sequelize.BelongsToSetAssociationMixin<OrderDetails, OrderDetailsId>;
  createOrder_detail!: Sequelize.BelongsToCreateAssociationMixin<OrderDetails>;

  static initModel(sequelize: Sequelize.Sequelize): typeof OrderGoods {
    return OrderGoods.init({
      order_goods_id: {
        autoIncrement: true,
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      quantity: {
        type: DataTypes.DECIMAL,
        allowNull: false
      },
      weight: {
        type: DataTypes.DECIMAL,
        allowNull: true
      },
      order_details_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
          model: 'OrderDetails',
          key: 'order_details_id'
        }
      },
      unit_of_measure: {
        type: DataTypes.STRING,
        allowNull: true
      },
    }, {
      sequelize,
      tableName: 'OrderGoods',
      schema: 'public',
      timestamps: false,
      indexes: [
        {
          name: "OrderGoods_pk",
          unique: true,
          fields: [
            {name: "order_goods_id"},
          ]
        },
      ]
    });
  }
}
