import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { Partner, PartnerId } from './Partner';

export interface AutoFleetAttributes {
  auto_fleet_id: number;
  partner_id: number;
  model: string;
  vin: string;
  reg_no: string;
  vignette_ro?: string;
  itp?: string;
  cmr_insurance?: string;
  rca?: string;
  carbon_copy?: string;
  vignette_hu?: string;
  vignette_slo?: string;
  casco?: string;
  max_weight_in_tons: number;
}

export type AutoFleetPk = "auto_fleet_id";
export type AutoFleetId = AutoFleet[AutoFleetPk];
export type AutoFleetOptionalAttributes = "auto_fleet_id" | "vignette_ro" | "itp" | "cmr_insurance" | "rca" | "carbon_copy" | "vignette_hu" | "vignette_slo" | "casco" | "max_weight_in_tons";
export type AutoFleetCreationAttributes = Optional<AutoFleetAttributes, AutoFleetOptionalAttributes>;

export class AutoFleet extends Model<AutoFleetAttributes, AutoFleetCreationAttributes> implements AutoFleetAttributes {
  auto_fleet_id!: number;
  partner_id!: number;
  model!: string;
  vin!: string;
  reg_no!: string;
  vignette_ro?: string;
  itp?: string;
  cmr_insurance?: string;
  rca?: string;
  carbon_copy?: string;
  vignette_hu?: string;
  vignette_slo?: string;
  casco?: string;
  max_weight_in_tons: number;

  // AutoFleet belongsTo Partner via partner_id
  partner!: Partner;
  getPartner!: Sequelize.BelongsToGetAssociationMixin<Partner>;
  setPartner!: Sequelize.BelongsToSetAssociationMixin<Partner, PartnerId>;
  createPartner!: Sequelize.BelongsToCreateAssociationMixin<Partner>;

  static initModel(sequelize: Sequelize.Sequelize): typeof AutoFleet {
    return AutoFleet.init({
    auto_fleet_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
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
    model: {
      type: DataTypes.STRING,
      allowNull: false
    },
    vin: {
      type: DataTypes.STRING,
      allowNull: false
    },
    reg_no: {
      type: DataTypes.STRING,
      allowNull: false
    },
    vignette_ro: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    itp: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    cmr_insurance: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    rca: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    carbon_copy: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    vignette_hu: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    vignette_slo: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    casco: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    max_weight_in_tons: {
      type: DataTypes.NUMBER,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'AutoFleet',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "AutoFleet_pk",
        unique: true,
        fields: [
          { name: "auto_fleet_id" },
        ]
      },
    ]
  });
  }
}
