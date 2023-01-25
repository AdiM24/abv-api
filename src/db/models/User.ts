import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface UserAttributes {
  user_id: number;
  first_name?: string;
  last_name?: string;
  created_at_utc: string;
  updated_at_utc: string;
  email: string;
  password: string;
  phone?: string;
}

export type UserPk = "user_id";
export type UserId = User[UserPk];
export type UserOptionalAttributes = "user_id" | "first_name" | "last_name" | "created_at_utc" | "updated_at_utc" | "phone";
export type UserCreationAttributes = Optional<UserAttributes, UserOptionalAttributes>;

export class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  user_id!: number;
  first_name?: string;
  last_name?: string;
  created_at_utc!: string;
  updated_at_utc!: string;
  email!: string;
  password!: string;
  phone?: string;


  static initModel(sequelize: Sequelize.Sequelize): typeof User {
    return User.init({
    user_id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    first_name: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    last_name: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    created_at_utc: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.literal("(now() AT TIME ZONE 'utc'::text)")
    },
    updated_at_utc: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.literal("(now() AT TIME ZONE 'utc'::text)")
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'User',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "User_pkey",
        unique: true,
        fields: [
          { name: "user_id" },
        ]
      },
    ]
  });
  }
}
