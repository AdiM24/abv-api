import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { ImageFiles, ImageFilesId } from './ImageFiles';
import type { Partner, PartnerId } from './Partner';

export interface PartnerImageAttributes {
  partner_image_id: number;
  image_id: number;
  partner_id: number;
  type: "LOGO";
}

export type PartnerImagePk = "partner_image_id";
export type PartnerImageId = PartnerImage[PartnerImagePk];
export type PartnerImageOptionalAttributes = "partner_image_id";
export type PartnerImageCreationAttributes = Optional<PartnerImageAttributes, PartnerImageOptionalAttributes>;

export class PartnerImage extends Model<PartnerImageAttributes, PartnerImageCreationAttributes> implements PartnerImageAttributes {
  partner_image_id!: number;
  image_id!: number;
  partner_id!: number;
  type!: "LOGO";

  // PartnerImage belongsTo ImageFiles via image_id
  image!: ImageFiles;
  getImage!: Sequelize.BelongsToGetAssociationMixin<ImageFiles>;
  setImage!: Sequelize.BelongsToSetAssociationMixin<ImageFiles, ImageFilesId>;
  createImage!: Sequelize.BelongsToCreateAssociationMixin<ImageFiles>;
  // PartnerImage belongsTo Partner via partner_id
  partner!: Partner;
  getPartner!: Sequelize.BelongsToGetAssociationMixin<Partner>;
  setPartner!: Sequelize.BelongsToSetAssociationMixin<Partner, PartnerId>;
  createPartner!: Sequelize.BelongsToCreateAssociationMixin<Partner>;

  static initModel(sequelize: Sequelize.Sequelize): typeof PartnerImage {
    return PartnerImage.init({
    partner_image_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    image_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'ImageFiles',
        key: 'id'
      }
    },
    partner_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Partner',
        key: 'partner_id'
      }
    },
    type: {
      type: DataTypes.ENUM("LOGO"),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'PartnerImage',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "PartnerImage_pk",
        unique: true,
        fields: [
          { name: "partner_image_id" },
        ]
      },
    ]
  });
  }
}
