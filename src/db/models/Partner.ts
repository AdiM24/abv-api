import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { Address, AddressId } from './Address';
import type { AutoFleet, AutoFleetId } from './AutoFleet';
import type { BankAccount, BankAccountId } from './BankAccount';
import type { BankRegister, BankRegisterId } from './BankRegister';
import type { CashRegister, CashRegisterId } from './CashRegister';
import type { Contact, ContactId } from './Contact';
import type { Employee, EmployeeId } from './Employee';
import type { Invoice, InvoiceId } from './Invoice';
import type { User, UserId } from './User';

export interface PartnerAttributes {
  partner_id: number;
  name: string;
  unique_identification_number: string;
  trade_register_registration_number: string;
  credit: number;
  remaining_credit: number;
  vat_payer: boolean;
  vat_split: boolean;
  vat_collection: boolean;
  invoice_deadline_days?: number;
  credit_exceedance_percentage?: number;
  created_at_utc: Date;
  modified_at_utc: Date;
  address?: string;
  user_id?: number;
}

export type PartnerPk = "partner_id";
export type PartnerId = Partner[PartnerPk];
export type PartnerOptionalAttributes = "partner_id" | "credit" | "remaining_credit" | "invoice_deadline_days" | "credit_exceedance_percentage" | "created_at_utc" | "modified_at_utc" | "address" | "user_id";
export type PartnerCreationAttributes = Optional<PartnerAttributes, PartnerOptionalAttributes>;

export class Partner extends Model<PartnerAttributes, PartnerCreationAttributes> implements PartnerAttributes {
  partner_id!: number;
  name!: string;
  unique_identification_number!: string;
  trade_register_registration_number!: string;
  credit!: number;
  remaining_credit!: number;
  vat_payer!: boolean;
  vat_split!: boolean;
  vat_collection!: boolean;
  invoice_deadline_days?: number;
  credit_exceedance_percentage?: number;
  created_at_utc!: Date;
  modified_at_utc!: Date;
  address?: string;
  user_id?: number;

  // Partner hasMany Address via partner_id
  Addresses!: Address[];
  getAddresses!: Sequelize.HasManyGetAssociationsMixin<Address>;
  setAddresses!: Sequelize.HasManySetAssociationsMixin<Address, AddressId>;
  addAddress!: Sequelize.HasManyAddAssociationMixin<Address, AddressId>;
  addAddresses!: Sequelize.HasManyAddAssociationsMixin<Address, AddressId>;
  createAddress!: Sequelize.HasManyCreateAssociationMixin<Address>;
  removeAddress!: Sequelize.HasManyRemoveAssociationMixin<Address, AddressId>;
  removeAddresses!: Sequelize.HasManyRemoveAssociationsMixin<Address, AddressId>;
  hasAddress!: Sequelize.HasManyHasAssociationMixin<Address, AddressId>;
  hasAddresses!: Sequelize.HasManyHasAssociationsMixin<Address, AddressId>;
  countAddresses!: Sequelize.HasManyCountAssociationsMixin;
  // Partner hasMany AutoFleet via partner_id
  AutoFleets!: AutoFleet[];
  getAutoFleets!: Sequelize.HasManyGetAssociationsMixin<AutoFleet>;
  setAutoFleets!: Sequelize.HasManySetAssociationsMixin<AutoFleet, AutoFleetId>;
  addAutoFleet!: Sequelize.HasManyAddAssociationMixin<AutoFleet, AutoFleetId>;
  addAutoFleets!: Sequelize.HasManyAddAssociationsMixin<AutoFleet, AutoFleetId>;
  createAutoFleet!: Sequelize.HasManyCreateAssociationMixin<AutoFleet>;
  removeAutoFleet!: Sequelize.HasManyRemoveAssociationMixin<AutoFleet, AutoFleetId>;
  removeAutoFleets!: Sequelize.HasManyRemoveAssociationsMixin<AutoFleet, AutoFleetId>;
  hasAutoFleet!: Sequelize.HasManyHasAssociationMixin<AutoFleet, AutoFleetId>;
  hasAutoFleets!: Sequelize.HasManyHasAssociationsMixin<AutoFleet, AutoFleetId>;
  countAutoFleets!: Sequelize.HasManyCountAssociationsMixin;
  // Partner hasMany BankAccount via partner_id
  BankAccounts!: BankAccount[];
  getBankAccounts!: Sequelize.HasManyGetAssociationsMixin<BankAccount>;
  setBankAccounts!: Sequelize.HasManySetAssociationsMixin<BankAccount, BankAccountId>;
  addBankAccount!: Sequelize.HasManyAddAssociationMixin<BankAccount, BankAccountId>;
  addBankAccounts!: Sequelize.HasManyAddAssociationsMixin<BankAccount, BankAccountId>;
  createBankAccount!: Sequelize.HasManyCreateAssociationMixin<BankAccount>;
  removeBankAccount!: Sequelize.HasManyRemoveAssociationMixin<BankAccount, BankAccountId>;
  removeBankAccounts!: Sequelize.HasManyRemoveAssociationsMixin<BankAccount, BankAccountId>;
  hasBankAccount!: Sequelize.HasManyHasAssociationMixin<BankAccount, BankAccountId>;
  hasBankAccounts!: Sequelize.HasManyHasAssociationsMixin<BankAccount, BankAccountId>;
  countBankAccounts!: Sequelize.HasManyCountAssociationsMixin;
  // Partner hasMany BankRegister via partner_id
  BankRegisters!: BankRegister[];
  getBankRegisters!: Sequelize.HasManyGetAssociationsMixin<BankRegister>;
  setBankRegisters!: Sequelize.HasManySetAssociationsMixin<BankRegister, BankRegisterId>;
  addBankRegister!: Sequelize.HasManyAddAssociationMixin<BankRegister, BankRegisterId>;
  addBankRegisters!: Sequelize.HasManyAddAssociationsMixin<BankRegister, BankRegisterId>;
  createBankRegister!: Sequelize.HasManyCreateAssociationMixin<BankRegister>;
  removeBankRegister!: Sequelize.HasManyRemoveAssociationMixin<BankRegister, BankRegisterId>;
  removeBankRegisters!: Sequelize.HasManyRemoveAssociationsMixin<BankRegister, BankRegisterId>;
  hasBankRegister!: Sequelize.HasManyHasAssociationMixin<BankRegister, BankRegisterId>;
  hasBankRegisters!: Sequelize.HasManyHasAssociationsMixin<BankRegister, BankRegisterId>;
  countBankRegisters!: Sequelize.HasManyCountAssociationsMixin;
  // Partner hasMany CashRegister via partner_id
  CashRegisters!: CashRegister[];
  getCashRegisters!: Sequelize.HasManyGetAssociationsMixin<CashRegister>;
  setCashRegisters!: Sequelize.HasManySetAssociationsMixin<CashRegister, CashRegisterId>;
  addCashRegister!: Sequelize.HasManyAddAssociationMixin<CashRegister, CashRegisterId>;
  addCashRegisters!: Sequelize.HasManyAddAssociationsMixin<CashRegister, CashRegisterId>;
  createCashRegister!: Sequelize.HasManyCreateAssociationMixin<CashRegister>;
  removeCashRegister!: Sequelize.HasManyRemoveAssociationMixin<CashRegister, CashRegisterId>;
  removeCashRegisters!: Sequelize.HasManyRemoveAssociationsMixin<CashRegister, CashRegisterId>;
  hasCashRegister!: Sequelize.HasManyHasAssociationMixin<CashRegister, CashRegisterId>;
  hasCashRegisters!: Sequelize.HasManyHasAssociationsMixin<CashRegister, CashRegisterId>;
  countCashRegisters!: Sequelize.HasManyCountAssociationsMixin;
  // Partner hasMany Contact via partner_id
  Contacts!: Contact[];
  getContacts!: Sequelize.HasManyGetAssociationsMixin<Contact>;
  setContacts!: Sequelize.HasManySetAssociationsMixin<Contact, ContactId>;
  addContact!: Sequelize.HasManyAddAssociationMixin<Contact, ContactId>;
  addContacts!: Sequelize.HasManyAddAssociationsMixin<Contact, ContactId>;
  createContact!: Sequelize.HasManyCreateAssociationMixin<Contact>;
  removeContact!: Sequelize.HasManyRemoveAssociationMixin<Contact, ContactId>;
  removeContacts!: Sequelize.HasManyRemoveAssociationsMixin<Contact, ContactId>;
  hasContact!: Sequelize.HasManyHasAssociationMixin<Contact, ContactId>;
  hasContacts!: Sequelize.HasManyHasAssociationsMixin<Contact, ContactId>;
  countContacts!: Sequelize.HasManyCountAssociationsMixin;
  // Partner hasMany Employee via partner_id
  Employees!: Employee[];
  getEmployees!: Sequelize.HasManyGetAssociationsMixin<Employee>;
  setEmployees!: Sequelize.HasManySetAssociationsMixin<Employee, EmployeeId>;
  addEmployee!: Sequelize.HasManyAddAssociationMixin<Employee, EmployeeId>;
  addEmployees!: Sequelize.HasManyAddAssociationsMixin<Employee, EmployeeId>;
  createEmployee!: Sequelize.HasManyCreateAssociationMixin<Employee>;
  removeEmployee!: Sequelize.HasManyRemoveAssociationMixin<Employee, EmployeeId>;
  removeEmployees!: Sequelize.HasManyRemoveAssociationsMixin<Employee, EmployeeId>;
  hasEmployee!: Sequelize.HasManyHasAssociationMixin<Employee, EmployeeId>;
  hasEmployees!: Sequelize.HasManyHasAssociationsMixin<Employee, EmployeeId>;
  countEmployees!: Sequelize.HasManyCountAssociationsMixin;
  // Partner hasMany Invoice via buyer_id
  Invoices!: Invoice[];
  getInvoices!: Sequelize.HasManyGetAssociationsMixin<Invoice>;
  setInvoices!: Sequelize.HasManySetAssociationsMixin<Invoice, InvoiceId>;
  addInvoice!: Sequelize.HasManyAddAssociationMixin<Invoice, InvoiceId>;
  addInvoices!: Sequelize.HasManyAddAssociationsMixin<Invoice, InvoiceId>;
  createInvoice!: Sequelize.HasManyCreateAssociationMixin<Invoice>;
  removeInvoice!: Sequelize.HasManyRemoveAssociationMixin<Invoice, InvoiceId>;
  removeInvoices!: Sequelize.HasManyRemoveAssociationsMixin<Invoice, InvoiceId>;
  hasInvoice!: Sequelize.HasManyHasAssociationMixin<Invoice, InvoiceId>;
  hasInvoices!: Sequelize.HasManyHasAssociationsMixin<Invoice, InvoiceId>;
  countInvoices!: Sequelize.HasManyCountAssociationsMixin;
  // Partner hasMany Invoice via client_id
  client_Invoices!: Invoice[];
  getClient_Invoices!: Sequelize.HasManyGetAssociationsMixin<Invoice>;
  setClient_Invoices!: Sequelize.HasManySetAssociationsMixin<Invoice, InvoiceId>;
  addClient_Invoice!: Sequelize.HasManyAddAssociationMixin<Invoice, InvoiceId>;
  addClient_Invoices!: Sequelize.HasManyAddAssociationsMixin<Invoice, InvoiceId>;
  createClient_Invoice!: Sequelize.HasManyCreateAssociationMixin<Invoice>;
  removeClient_Invoice!: Sequelize.HasManyRemoveAssociationMixin<Invoice, InvoiceId>;
  removeClient_Invoices!: Sequelize.HasManyRemoveAssociationsMixin<Invoice, InvoiceId>;
  hasClient_Invoice!: Sequelize.HasManyHasAssociationMixin<Invoice, InvoiceId>;
  hasClient_Invoices!: Sequelize.HasManyHasAssociationsMixin<Invoice, InvoiceId>;
  countClient_Invoices!: Sequelize.HasManyCountAssociationsMixin;
  // Partner belongsTo User via user_id
  user!: User;
  getUser!: Sequelize.BelongsToGetAssociationMixin<User>;
  setUser!: Sequelize.BelongsToSetAssociationMixin<User, UserId>;
  createUser!: Sequelize.BelongsToCreateAssociationMixin<User>;

  static initModel(sequelize: Sequelize.Sequelize): typeof Partner {
    return Partner.init({
    partner_id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    unique_identification_number: {
      type: DataTypes.STRING,
      allowNull: false
    },
    trade_register_registration_number: {
      type: DataTypes.STRING,
      allowNull: false
    },
    credit: {
      type: DataTypes.DECIMAL(19,4),
      allowNull: false,
      defaultValue: 0
    },
    remaining_credit: {
      type: DataTypes.DECIMAL(19,4),
      allowNull: false,
      defaultValue: 0
    },
    vat_payer: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    vat_split: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    vat_collection: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    invoice_deadline_days: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    credit_exceedance_percentage: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    created_at_utc: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.literal('(now() AT TIME ZONE utc')
    },
    modified_at_utc: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.literal('(now() AT TIME ZONE utc')
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true
    },
    user_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: {
        model: 'User',
        key: 'user_id'
      }
    }
  }, {
    sequelize,
    tableName: 'Partner',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "Partner_pkey",
        unique: true,
        fields: [
          { name: "partner_id" },
        ]
      },
    ]
  });
  }
}
