import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { Partner, PartnerId } from './Partner';

export interface EmployeeAttributes {
  employee_id: number;
  partner_id?: number;
  first_name: string;
  last_name?: string;
  nationality?: string;
  social_security_number: string;
  ssn_series: string;
  ssn_number: number;
  phone?: string;
  email?: string;
  town: string;
  address: string;
  ssn_provider: string;
  ssn_start_date: string;
  ssn_end_date: string;
  employment_type?: "full time" | "part time";
  working_hours?: number;
  profession?: string;
}

export type EmployeePk = "employee_id";
export type EmployeeId = Employee[EmployeePk];
export type EmployeeOptionalAttributes = "employee_id" | "partner_id" | "last_name" | "nationality" | "phone" | "email" | "employment_type" | "working_hours" | "profession";
export type EmployeeCreationAttributes = Optional<EmployeeAttributes, EmployeeOptionalAttributes>;

export class Employee extends Model<EmployeeAttributes, EmployeeCreationAttributes> implements EmployeeAttributes {
  employee_id!: number;
  partner_id?: number;
  first_name!: string;
  last_name?: string;
  nationality?: string;
  social_security_number!: string;
  ssn_series!: string;
  ssn_number!: number;
  phone?: string;
  email?: string;
  town!: string;
  address!: string;
  ssn_provider!: string;
  ssn_start_date!: string;
  ssn_end_date!: string;
  employment_type?: "full time" | "part time";
  working_hours?: number;
  profession?: string;

  // Employee belongsTo Partner via partner_id
  partner!: Partner;
  getPartner!: Sequelize.BelongsToGetAssociationMixin<Partner>;
  setPartner!: Sequelize.BelongsToSetAssociationMixin<Partner, PartnerId>;
  createPartner!: Sequelize.BelongsToCreateAssociationMixin<Partner>;

  static initModel(sequelize: Sequelize.Sequelize): typeof Employee {
    return Employee.init({
    employee_id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    partner_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Partner',
        key: 'partner_id'
      }
    },
    first_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    nationality: {
      type: DataTypes.STRING,
      allowNull: true
    },
    social_security_number: {
      type: DataTypes.STRING,
      allowNull: false
    },
    ssn_series: {
      type: DataTypes.STRING,
      allowNull: false
    },
    ssn_number: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true
    },
    town: {
      type: DataTypes.STRING,
      allowNull: false
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false
    },
    ssn_provider: {
      type: DataTypes.STRING,
      allowNull: false
    },
    ssn_start_date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    ssn_end_date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    employment_type: {
      type: DataTypes.ENUM("full time","part time"),
      allowNull: true
    },
    working_hours: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    profession: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'Employee',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "Employee_pk",
        unique: true,
        fields: [
          { name: "employee_id" },
        ]
      },
    ]
  });
  }
}
