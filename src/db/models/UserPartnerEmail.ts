import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { Partner, PartnerId } from './Partner';
import type { User, UserId } from './User';

export interface UserPartnerEmailAttributes {
  user_partner_email_id: number;
  user_id: number;
  partner_id: number;
  partner_email: string;
  password: string;
  smtp: string;
}

export type UserPartnerEmailPk = "user_partner_email_id";
export type UserPartnerEmailId = UserPartnerEmail[UserPartnerEmailPk];
export type UserPartnerEmailOptionalAttributes = "user_partner_email_id";
export type UserPartnerEmailCreationAttributes = Optional<UserPartnerEmailAttributes, UserPartnerEmailOptionalAttributes>;

export class UserPartnerEmail extends Model<UserPartnerEmailAttributes, UserPartnerEmailCreationAttributes> implements UserPartnerEmailAttributes {
  user_partner_email_id!: number;
  user_id!: number;
  partner_id!: number;
  partner_email!: string;
  password!: string;
  smtp!: string;

  // UserPartnerEmail belongsTo Partner via partner_id
  partner!: Partner;
  getPartner!: Sequelize.BelongsToGetAssociationMixin<Partner>;
  setPartner!: Sequelize.BelongsToSetAssociationMixin<Partner, PartnerId>;
  createPartner!: Sequelize.BelongsToCreateAssociationMixin<Partner>;
  // UserPartnerEmail belongsTo User via user_id
  user!: User;
  getUser!: Sequelize.BelongsToGetAssociationMixin<User>;
  setUser!: Sequelize.BelongsToSetAssociationMixin<User, UserId>;
  createUser!: Sequelize.BelongsToCreateAssociationMixin<User>;

  static initModel(sequelize: Sequelize.Sequelize): typeof UserPartnerEmail {
    return UserPartnerEmail.init({
    user_partner_email_id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'User',
        key: 'user_id'
      }
    },
    partner_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'Partner',
        key: 'partner_id'
      }
    },
    partner_email: {
      type: DataTypes.STRING,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    smtp: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'UserPartnerEmail',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "UserPartnerEmail_pk",
        unique: true,
        fields: [
          { name: "user_partner_email_id" },
        ]
      },
    ]
  });
  }
}
