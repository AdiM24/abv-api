import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { Invoice, InvoiceId } from './Invoice';
import type { Product, ProductId } from './Product';

export interface InvoiceProductAttributes {
  invoice_product_id: number;
  invoice_id: number;
  product_id: number;
  quantity: number;
  selling_price: number;
  sold_at_utc?: string;
}

export type InvoiceProductPk = "invoice_product_id";
export type InvoiceProductId = InvoiceProduct[InvoiceProductPk];
export type InvoiceProductOptionalAttributes = "invoice_product_id" | "quantity" | "sold_at_utc";
export type InvoiceProductCreationAttributes = Optional<InvoiceProductAttributes, InvoiceProductOptionalAttributes>;

export class InvoiceProduct extends Model<InvoiceProductAttributes, InvoiceProductCreationAttributes> implements InvoiceProductAttributes {
  invoice_product_id!: number;
  invoice_id!: number;
  product_id!: number;
  quantity!: number;
  selling_price!: number;
  sold_at_utc?: string;

  // InvoiceProduct belongsTo Invoice via invoice_id
  invoice!: Invoice;
  getInvoice!: Sequelize.BelongsToGetAssociationMixin<Invoice>;
  setInvoice!: Sequelize.BelongsToSetAssociationMixin<Invoice, InvoiceId>;
  createInvoice!: Sequelize.BelongsToCreateAssociationMixin<Invoice>;
  // InvoiceProduct belongsTo Product via product_id
  product!: Product;
  getProduct!: Sequelize.BelongsToGetAssociationMixin<Product>;
  setProduct!: Sequelize.BelongsToSetAssociationMixin<Product, ProductId>;
  createProduct!: Sequelize.BelongsToCreateAssociationMixin<Product>;

  static initModel(sequelize: Sequelize.Sequelize): typeof InvoiceProduct {
    return InvoiceProduct.init({
    invoice_product_id: {
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
    product_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'Product',
        key: 'product_id'
      }
    },
    quantity: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      defaultValue: 0
    },
    selling_price: {
      type: DataTypes.DECIMAL,
      allowNull: false
    },
    sold_at_utc: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.literal('(now() AT TIME ZONE utc')
    }
  }, {
    sequelize,
    tableName: 'InvoiceProduct',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "InvoiceProducts_pk",
        unique: true,
        fields: [
          { name: "invoice_product_id" },
        ]
      },
    ]
  });
  }
}
