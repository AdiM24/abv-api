import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { Address, AddressId } from './Address';
import type { Employee, EmployeeId } from './Employee';

export interface TimesheetEntryAttributes {
  timesheet_entry_id: number;
  employee_id?: number;
  hours_worked: string;
  date: string;
  address_id?: number;
}

export type TimesheetEntryPk = "timesheet_entry_id";
export type TimesheetEntryId = TimesheetEntry[TimesheetEntryPk];
export type TimesheetEntryOptionalAttributes = "timesheet_entry_id" | "employee_id" | "address_id";
export type TimesheetEntryCreationAttributes = Optional<TimesheetEntryAttributes, TimesheetEntryOptionalAttributes>;

export class TimesheetEntry extends Model<TimesheetEntryAttributes, TimesheetEntryCreationAttributes> implements TimesheetEntryAttributes {
  timesheet_entry_id!: number;
  employee_id?: number;
  hours_worked!: string;
  date!: string;
  address_id?: number;

  // TimesheetEntry belongsTo Address via address_id
  address!: Address;
  getAddress!: Sequelize.BelongsToGetAssociationMixin<Address>;
  setAddress!: Sequelize.BelongsToSetAssociationMixin<Address, AddressId>;
  createAddress!: Sequelize.BelongsToCreateAssociationMixin<Address>;
  // TimesheetEntry belongsTo Employee via employee_id
  employee!: Employee;
  getEmployee!: Sequelize.BelongsToGetAssociationMixin<Employee>;
  setEmployee!: Sequelize.BelongsToSetAssociationMixin<Employee, EmployeeId>;
  createEmployee!: Sequelize.BelongsToCreateAssociationMixin<Employee>;

  static initModel(sequelize: Sequelize.Sequelize): typeof TimesheetEntry {
    return TimesheetEntry.init({
    timesheet_entry_id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    employee_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Employee',
        key: 'employee_id'
      },
      unique: "TimesheetEntry_pk2"
    },
    hours_worked: {
      type: DataTypes.STRING,
      allowNull: false
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      unique: "TimesheetEntry_pk2"
    },
    address_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: {
        model: 'Address',
        key: 'address_id'
      }
    }
  }, {
    sequelize,
    tableName: 'TimesheetEntry',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "TimesheetEntry_pk",
        unique: true,
        fields: [
          { name: "timesheet_entry_id" },
        ]
      },
      {
        name: "TimesheetEntry_pk2",
        unique: true,
        fields: [
          { name: "employee_id" },
          { name: "date" },
        ]
      },
    ]
  });
  }
}
