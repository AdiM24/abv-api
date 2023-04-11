import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { Partner, PartnerId } from './Partner';
import type { User, UserId } from './User';

export interface PartnerCommentAttributes {
  partner_comment_id: number;
  partner_id: number;
  user_id: number;
  created_at_utc: string;
  comment: string;
}

export type PartnerCommentPk = "partner_comment_id";
export type PartnerCommentId = PartnerComment[PartnerCommentPk];
export type PartnerCommentOptionalAttributes = "partner_comment_id" | "created_at_utc";
export type PartnerCommentCreationAttributes = Optional<PartnerCommentAttributes, PartnerCommentOptionalAttributes>;

export class PartnerComment extends Model<PartnerCommentAttributes, PartnerCommentCreationAttributes> implements PartnerCommentAttributes {
  partner_comment_id!: number;
  partner_id!: number;
  user_id!: number;
  created_at_utc!: string;
  comment!: string;

  // PartnerComment belongsTo Partner via partner_id
  partner!: Partner;
  getPartner!: Sequelize.BelongsToGetAssociationMixin<Partner>;
  setPartner!: Sequelize.BelongsToSetAssociationMixin<Partner, PartnerId>;
  createPartner!: Sequelize.BelongsToCreateAssociationMixin<Partner>;
  // PartnerComment belongsTo User via user_id
  user!: User;
  getUser!: Sequelize.BelongsToGetAssociationMixin<User>;
  setUser!: Sequelize.BelongsToSetAssociationMixin<User, UserId>;
  createUser!: Sequelize.BelongsToCreateAssociationMixin<User>;

  static initModel(sequelize: Sequelize.Sequelize): typeof PartnerComment {
    return PartnerComment.init({
    partner_comment_id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    partner_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'Partner',
        key: 'partner_id'
      }
    },
    user_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'User',
        key: 'user_id'
      }
    },
    created_at_utc: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.fn('now')
    },
    comment: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'PartnerComment',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "PartnerComment_pk",
        unique: true,
        fields: [
          { name: "partner_comment_id" },
        ]
      },
    ]
  });
  }
}
