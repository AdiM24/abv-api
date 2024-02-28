import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface LocalityAttributes {
  locality_id: number;
  city: string;
  county: string;
  county_auto: string;
}

export type LocalityPk = "locality_id";
export type LocalitateId = Locality[LocalityPk];
export type LocalitateOptionalAttributes = "locality_id" | "city" | "county" | "county_auto";

export type LocalityCreationAttributes = Optional<LocalityAttributes, LocalitateOptionalAttributes>;

export class Locality extends Model<LocalityAttributes> implements LocalityAttributes {
  locality_id: number;
  city: string;
  county: string;
  county_auto: string;

  static initModel(sequelize: Sequelize.Sequelize): typeof Locality {
    return Locality.init({
      locality_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
      city: {
      type: DataTypes.STRING,
      allowNull: false
    },
      county: {
      type: DataTypes.STRING,
      allowNull: false
    },
      county_auto: {
        type: DataTypes.STRING,
        allowNull: false
      }
  }, {
    sequelize,
    tableName: 'Localities',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "Locality_pkey",
        unique: true,
        fields: [
          { name: "locality_id" },
        ]
      },
    ]
  });
  }
}
