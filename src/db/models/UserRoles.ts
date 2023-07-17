import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { User, UserId } from './User';

export interface UserRolesAttributes {
  user_role_id: number;
  role: number;
  user_id?: number;
}

export type UserRolesPk = "user_role_id";
export type UserRolesId = UserRoles[UserRolesPk];
export type UserRolesOptionalAttributes = "user_role_id" | "role" |  "user_id";
export type UserRolesCreationAttributes = Optional<UserRolesAttributes, UserRolesOptionalAttributes>;

export class UserRoles extends Model<UserRolesAttributes, UserRolesCreationAttributes> implements UserRolesAttributes {
  user_role_id!: number;
  role!: number;
  user_id?: number;

  // UserRoles belongsTo User via user_id
  user!: User;
  getUser!: Sequelize.BelongsToGetAssociationMixin<User>;
  setUser!: Sequelize.BelongsToSetAssociationMixin<User, UserId>;
  createUser!: Sequelize.BelongsToCreateAssociationMixin<User>;

  static initModel(sequelize: Sequelize.Sequelize): typeof UserRoles {
    return UserRoles.init({
    user_role_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    role: {
      type: DataTypes.NUMBER,
      allowNull: false
    },
    user_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: {
        model: 'User',
        key: 'user_id'
      }
    }
  }, {
    sequelize,
    tableName: 'UserRoles',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "UserRoles_pk",
        unique: true,
        fields: [
          { name: "user_role_id" },
        ]
      },
    ]
  });
  }
}
