import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { User, UserId } from './User';

export interface UserInvoiceSeriesAttributes {
  user_invoice_series_id: number;
  user_id?: number;
  invoice_type?: "proforma" | "issued" | "received" | "notice";
  series?: string;
  default?: boolean;
}

export type UserInvoiceSeriesPk = "user_invoice_series_id";
export type UserInvoiceSeriesId = UserInvoiceSeries[UserInvoiceSeriesPk];
export type UserInvoiceSeriesOptionalAttributes = "user_invoice_series_id" | "user_id" | "invoice_type" | "series" | "default";
export type UserInvoiceSeriesCreationAttributes = Optional<UserInvoiceSeriesAttributes, UserInvoiceSeriesOptionalAttributes>;

export class UserInvoiceSeries extends Model<UserInvoiceSeriesAttributes, UserInvoiceSeriesCreationAttributes> implements UserInvoiceSeriesAttributes {
  user_invoice_series_id!: number;
  user_id?: number;
  invoice_type?: "proforma" | "issued" | "received" | "notice";
  series?: string;
  default?: boolean;

  // UserInvoiceSeries belongsTo User via user_id
  user!: User;
  getUser!: Sequelize.BelongsToGetAssociationMixin<User>;
  setUser!: Sequelize.BelongsToSetAssociationMixin<User, UserId>;
  createUser!: Sequelize.BelongsToCreateAssociationMixin<User>;

  static initModel(sequelize: Sequelize.Sequelize): typeof UserInvoiceSeries {
    return UserInvoiceSeries.init({
    user_invoice_series_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'User',
        key: 'user_id'
      }
    },
    invoice_type: {
      type: DataTypes.ENUM("proforma","issued","received","notice"),
      allowNull: true
    },
    series: {
      type: DataTypes.STRING,
      allowNull: true
    },
    default: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'UserInvoiceSeries',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "UserInvoiceSeries_pk",
        unique: true,
        fields: [
          { name: "user_invoice_series_id" },
        ]
      },
    ]
  });
  }
}
