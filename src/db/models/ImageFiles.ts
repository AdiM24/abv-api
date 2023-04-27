import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { PartnerImage, PartnerImageId } from './PartnerImage';

export interface ImageFilesAttributes {
  id: number;
  filename: string;
  filepath: string;
  mimetype: string;
  size: number;
}

export type ImageFilesPk = "id";
export type ImageFilesId = ImageFiles[ImageFilesPk];
export type ImageFilesOptionalAttributes = "id";
export type ImageFilesCreationAttributes = Optional<ImageFilesAttributes, ImageFilesOptionalAttributes>;

export class ImageFiles extends Model<ImageFilesAttributes, ImageFilesCreationAttributes> implements ImageFilesAttributes {
  id!: number;
  filename!: string;
  filepath!: string;
  mimetype!: string;
  size!: number;

  // ImageFiles hasMany PartnerImage via image_id
  PartnerImages!: PartnerImage[];
  getPartnerImages!: Sequelize.HasManyGetAssociationsMixin<PartnerImage>;
  setPartnerImages!: Sequelize.HasManySetAssociationsMixin<PartnerImage, PartnerImageId>;
  addPartnerImage!: Sequelize.HasManyAddAssociationMixin<PartnerImage, PartnerImageId>;
  addPartnerImages!: Sequelize.HasManyAddAssociationsMixin<PartnerImage, PartnerImageId>;
  createPartnerImage!: Sequelize.HasManyCreateAssociationMixin<PartnerImage>;
  removePartnerImage!: Sequelize.HasManyRemoveAssociationMixin<PartnerImage, PartnerImageId>;
  removePartnerImages!: Sequelize.HasManyRemoveAssociationsMixin<PartnerImage, PartnerImageId>;
  hasPartnerImage!: Sequelize.HasManyHasAssociationMixin<PartnerImage, PartnerImageId>;
  hasPartnerImages!: Sequelize.HasManyHasAssociationsMixin<PartnerImage, PartnerImageId>;
  countPartnerImages!: Sequelize.HasManyCountAssociationsMixin;

  static initModel(sequelize: Sequelize.Sequelize): typeof ImageFiles {
    return ImageFiles.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    filename: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: "imagefiles_filename_key"
    },
    filepath: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    mimetype: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    size: {
      type: DataTypes.BIGINT,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'ImageFiles',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "imagefiles_filename_key",
        unique: true,
        fields: [
          { name: "filename" },
        ]
      },
      {
        name: "imagefiles_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
  }
}
