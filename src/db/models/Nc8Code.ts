import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface Nc8CodeAttributes {
  nc8_code_id: number;
  code: string;
  description: number;
}

export type Nc8CodePk = "nc8_code_id";
export type NC8CodeId = Nc8Code[Nc8CodePk];
export type Nc8CodeOptionalAttributes = "nc8_code_id" | "code" | "description" ;

export type Nc8CodeCreationAttributes = Optional<Nc8CodeAttributes, Nc8CodeOptionalAttributes>;

export class Nc8Code extends Model<Nc8CodeAttributes> implements Nc8CodeAttributes {
  nc8_code_id: number;
  code: string;
  description: number;

  static initModel(sequelize: Sequelize.Sequelize): typeof Nc8Code {
    return Nc8Code.init({
      nc8_code_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
      code: {
      type: DataTypes.STRING,
      allowNull: false
    },
      description: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'Nc8Code',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "Nc8Code_pkey",
        unique: true,
        fields: [
          { name: "nc8_code_id" },
        ]
      },
    ]
  });
  }
}
