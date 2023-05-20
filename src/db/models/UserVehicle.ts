import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { AutoFleet, AutoFleetId } from './AutoFleet';
import type { User, UserId } from './User';

export interface UserVehicleAttributes {
  user_vehicle_id: number;
  user_id: number;
  vehicle_id: number;
}

export type UserVehiclePk = "user_vehicle_id";
export type UserVehicleId = UserVehicle[UserVehiclePk];
export type UserVehicleOptionalAttributes = "user_vehicle_id";
export type UserVehicleCreationAttributes = Optional<UserVehicleAttributes, UserVehicleOptionalAttributes>;

export class UserVehicle extends Model<UserVehicleAttributes, UserVehicleCreationAttributes> implements UserVehicleAttributes {
  user_vehicle_id!: number;
  user_id!: number;
  vehicle_id!: number;

  // UserVehicle belongsTo AutoFleet via vehicle_id
  vehicle!: AutoFleet;
  getVehicle!: Sequelize.BelongsToGetAssociationMixin<AutoFleet>;
  setVehicle!: Sequelize.BelongsToSetAssociationMixin<AutoFleet, AutoFleetId>;
  createVehicle!: Sequelize.BelongsToCreateAssociationMixin<AutoFleet>;
  // UserVehicle belongsTo User via user_id
  user!: User;
  getUser!: Sequelize.BelongsToGetAssociationMixin<User>;
  setUser!: Sequelize.BelongsToSetAssociationMixin<User, UserId>;
  createUser!: Sequelize.BelongsToCreateAssociationMixin<User>;

  static initModel(sequelize: Sequelize.Sequelize): typeof UserVehicle {
    return UserVehicle.init({
    user_vehicle_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'User',
        key: 'user_id'
      }
    },
    vehicle_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'AutoFleet',
        key: 'auto_fleet_id'
      }
    }
  }, {
    sequelize,
    tableName: 'UserVehicle',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "UserVehicle_pk",
        unique: true,
        fields: [
          { name: "user_vehicle_id" },
        ]
      },
    ]
  });
  }
}
