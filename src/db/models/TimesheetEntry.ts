import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { Employee, EmployeeId } from './Employee';

export interface TimesheetEntryAttributes {
  timesheet_entry_id: number;
  employee_id: number;
  hours_worked: number;
  date: Date;
}

export type TimesheetEntryPk = "timesheet_entry_id";
export type TimesheetEntryId = TimesheetEntry[TimesheetEntryPk];
export type TimesheetEntryOptionalAttributes = "timesheet_entry_id";
export type TimesheetEntryCreationAttributes = Optional<TimesheetEntryAttributes, TimesheetEntryOptionalAttributes>;

export class TimesheetEntry extends Model<TimesheetEntryAttributes, TimesheetEntryCreationAttributes> implements TimesheetEntryAttributes {
  timesheet_entry_id!: number;
  employee_id!: number;
  hours_worked!: number;
  date!: Date;

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
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'Employee',
        key: 'employee_id'
      }
    },
    hours_worked: {
      type: DataTypes.SMALLINT,
      allowNull: false
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'TimesheetEntry',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "Timesheet_pk",
        unique: true,
        fields: [
          { name: "timesheet_entry_id" },
        ]
      },
    ]
  });
  }
}
