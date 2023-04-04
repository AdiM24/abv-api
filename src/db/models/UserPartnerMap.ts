import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { Partner, PartnerId } from './Partner';
import type { User, UserId } from './User';

export interface UserPartnerMapAttributes {
  user_partner_map_id: number;
  partner_id: number;
  user_id: number;
}

export type UserPartnerMapPk = "user_partner_map_id";
export type UserPartnerMapId = UserPartnerMap[UserPartnerMapPk];
export type UserPartnerMapOptionalAttributes = "user_partner_map_id";
export type UserPartnerMapCreationAttributes = Optional<UserPartnerMapAttributes, UserPartnerMapOptionalAttributes>;

export class UserPartnerMap extends Model<UserPartnerMapAttributes, UserPartnerMapCreationAttributes> implements UserPartnerMapAttributes {
  user_partner_map_id!: number;
  partner_id!: number;
  user_id!: number;

  // UserPartnerMap belongsTo Partner via partner_id
  partner!: Partner;
  getPartner!: Sequelize.BelongsToGetAssociationMixin<Partner>;
  setPartner!: Sequelize.BelongsToSetAssociationMixin<Partner, PartnerId>;
  createPartner!: Sequelize.BelongsToCreateAssociationMixin<Partner>;
  // UserPartnerMap belongsTo User via user_id
  user!: User;
  getUser!: Sequelize.BelongsToGetAssociationMixin<User>;
  setUser!: Sequelize.BelongsToSetAssociationMixin<User, UserId>;
  createUser!: Sequelize.BelongsToCreateAssociationMixin<User>;

  static initModel(sequelize: Sequelize.Sequelize): typeof UserPartnerMap {
    return UserPartnerMap.init({
    user_partner_map_id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    partner_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Partner',
        key: 'partner_id'
      }
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'User',
        key: 'user_id'
      }
    }
  }, {
    sequelize,
    tableName: 'UserPartnerMap',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "UserPartnerMap_pk",
        unique: true,
        fields: [
          { name: "user_partner_map_id" },
        ]
      },
    ]
  });
  }
}
