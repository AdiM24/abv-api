import * as Sequelize from "sequelize";
import { Model, Optional, DataTypes } from "sequelize";
import { AutoFleet, AutoFleetId } from "./AutoFleet";
import { Partner, PartnerId } from "./Partner";

export interface DevizAttributes {
  deviz_id: number;
  auto_fleet_id?: number;
  partner_id?: number;
  date: Date;
  denumire: 'Leasing' | 'Casco' | 'RCA' | 'Diurna Sofer' | 'RO vigneta' | 'Hu vigneta' | 'Cauciucuri' | 'Autostrăzi' | 'Asigurare CMR' | 'Revizii' | 'Chirie' | 'Întreținere' | 'Digi' | 'Asibox' | 'Curieri' | 'CargoTrack' | 'Depozite' | 'Bugetul de stat' | 'Contribuții asig muncă' | 'TVA' | 'Burse' | 'Salarii angajați' | 'Bonuri' | 'Consumabile' | 'Alte cheltuieli';
  pret: number;
  infos?: string;
  currency: 'RON' | 'EUR';
}

export type DevizPk = 'deviz_id';
export type DevizId = Deviz[DevizPk];
export type DevizOptionalAttributes = 'deviz_id' | 'auto_fleet_id' | 'partner_id' | 'infos';
export type DevizCreationAttributes = Optional<DevizAttributes, DevizOptionalAttributes>;

export class Deviz extends Model<DevizAttributes, DevizCreationAttributes> implements DevizAttributes {
  deviz_id!: number;
  auto_fleet_id?: number;
  partner_id?: number;
  date!: Date;
  denumire!: 'Leasing' | 'Casco' | 'RCA' | 'Diurna Sofer' | 'RO vigneta' | 'Hu vigneta' | 'Cauciucuri' | 'Autostrăzi' | 'Asigurare CMR' | 'Revizii' | 'Chirie' | 'Întreținere' | 'Digi' | 'Asibox' | 'Curieri' | 'CargoTrack' | 'Depozite' | 'Bugetul de stat' | 'Contribuții asig muncă' | 'TVA' | 'Burse' | 'Salarii angajați' | 'Bonuri' | 'Consumabile' | 'Alte cheltuieli';
  pret: number;
  infos?: string;
  currency: 'RON' | 'EUR';

  // Deviz belongs to AutoFleet via auto_fleet_id
  AutoFleet!: AutoFleet;
  getAutoFleet!: Sequelize.BelongsToGetAssociationMixin<AutoFleet>;
  setAutoFleet!: Sequelize.BelongsToSetAssociationMixin<AutoFleet, AutoFleetId>;
  createAutoFleet!: Sequelize.BelongsToCreateAssociationMixin<AutoFleet>;

  // Deviz belongs to Partner via partner_id
  Partner!: Partner;
  getPartner!: Sequelize.BelongsToGetAssociationMixin<Partner>;
  setPartner!: Sequelize.BelongsToSetAssociationMixin<Partner, PartnerId>;
  createPartner!: Sequelize.BelongsToCreateAssociationMixin<Partner>;

  static initModel(sequelize: Sequelize.Sequelize): typeof Deviz {
    return Deviz.init({
      deviz_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      auto_fleet_id: {
        type: DataTypes.BIGINT,
        allowNull: true,
        references: {
          model: 'AutoFleet',
          key: 'auto_fleet_id'
        }
      },
      partner_id: {
        type: DataTypes.BIGINT,
        allowNull: true,
        references: {
          model: 'Partner',
          key: 'partner_id'
        }
      },
      date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        defaultValue: Sequelize.Sequelize.literal("(now() AT TIME ZONE 'utc'::text)")
      },
      denumire: {
        type: DataTypes.ENUM('Leasing', 'Casco', 'RCA', 'Diurna Sofer', 'RO vigneta', 'Hu vigneta', 'Cauciucuri', 'Autostrăzi', 'Asigurare CMR', 'Revizii', 'Chirie', 'Întreținere', 'Digi', 'Asibox', 'Curieri', 'CargoTrack', 'Depozite', 'Bugetul de stat', 'Contribuții asig muncă', 'TVA', 'Burse', 'Salarii angajați', 'Bonuri', 'Consumabile', 'Alte cheltuieli'),
        allowNull: false
      },
      pret: {
        type: DataTypes.DECIMAL,
        allowNull: false
      },
      infos: {
        type: DataTypes.STRING,
        allowNull: true
      },
      currency: {
        type: DataTypes.ENUM('RON', 'EUR'),
        allowNull: false
      }
    }, {
      sequelize,
      tableName: 'Deviz',
      schema: 'public',
      timestamps: false,
      indexes: [
        {
          name: 'Deviz_pk',
          unique: true,
          fields: [
            { name: 'deviz_id' }
          ]
        }
      ]
    })
  }
}
