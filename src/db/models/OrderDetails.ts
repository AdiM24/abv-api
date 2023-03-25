import * as Sequelize from 'sequelize';
import {DataTypes, Model, Optional} from 'sequelize';
import type {Invoice, InvoiceId} from './Invoice';
import type {OrderGoods, OrderGoodsId} from './OrderGoods';

export interface OrderDetailsAttributes {
  order_details_id: number;
  invoice_id: number;
  pick_up_address?: string;
  drop_off_address?: string;
  pick_up_date?: string;
  drop_off_date?: string;
  remarks?: string;
}

export type OrderDetailsPk = "order_details_id";
export type OrderDetailsId = OrderDetails[OrderDetailsPk];
export type OrderDetailsOptionalAttributes =
  "order_details_id"
  | "pick_up_address"
  | "drop_off_address"
  | "pick_up_date";
export type OrderDetailsCreationAttributes = Optional<OrderDetailsAttributes, OrderDetailsOptionalAttributes>;

export class OrderDetails extends Model<OrderDetailsAttributes, OrderDetailsCreationAttributes> implements OrderDetailsAttributes {
  order_details_id!: number;
  invoice_id!: number;
  pick_up_address?: string;
  drop_off_address?: string;
  pick_up_date?: string;
  drop_off_date?: string;
  remarks?: string;

  // OrderDetails belongsTo Invoice via invoice_id
  invoice!: Invoice;
  getInvoice!: Sequelize.BelongsToGetAssociationMixin<Invoice>;
  setInvoice!: Sequelize.BelongsToSetAssociationMixin<Invoice, InvoiceId>;
  createInvoice!: Sequelize.BelongsToCreateAssociationMixin<Invoice>;
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
      invoice_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
          model: 'Invoice',
          key: 'invoice_id'
        }
      },
      pick_up_address: {
        type: DataTypes.STRING,
        allowNull: true
      },
      drop_off_address: {
        type: DataTypes.STRING,
        allowNull: true
      },
      pick_up_date: {
        type: DataTypes.DATEONLY,
        allowNull: true
      },
      drop_off_date: {
        type: DataTypes.DATEONLY,
        allowNull: false
      },
      remarks: {
        type: DataTypes.STRING,
        allowNull: true
      },
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
            {name: "order_details_id"},
          ]
        },
      ]
    });
  }
}
