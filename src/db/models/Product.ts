import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { InvoiceProduct, InvoiceProductId } from './InvoiceProduct';

export interface ProductAttributes {
  product_id: number;
  product_name: string;
  quantity: number;
  purchase_price: number;
  vat: number;
  created_at_utc: Date;
  modified_at_utc?: Date;
}

export type ProductPk = "product_id";
export type ProductId = Product[ProductPk];
export type ProductOptionalAttributes = "product_id" | "quantity" | "purchase_price" | "vat" | "created_at_utc" | "modified_at_utc";
export type ProductCreationAttributes = Optional<ProductAttributes, ProductOptionalAttributes>;

export class Product extends Model<ProductAttributes, ProductCreationAttributes> implements ProductAttributes {
  product_id!: number;
  product_name!: string;
  quantity!: number;
  purchase_price!: number;
  vat!: number;
  created_at_utc!: Date;
  modified_at_utc?: Date;

  // Product hasMany InvoiceProducts via product_id
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

  static initModel(sequelize: Sequelize.Sequelize): typeof Product {
    return Product.init({
    product_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    product_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    purchase_price: {
      type: DataTypes.DECIMAL(19,4),
      allowNull: false,
      defaultValue: 0
    },
    vat: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    created_at_utc: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.literal("(now() AT TIME ZONE 'utc'::text)")
    },
    modified_at_utc: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.literal("(now() AT TIME ZONE 'utc'::text)")
    }
  }, {
    sequelize,
    tableName: 'Product',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "Product_pk",
        unique: true,
        fields: [
          { name: "product_id" },
        ]
      },
    ]
  });
  }
}
