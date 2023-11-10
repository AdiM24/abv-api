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
import type { Order, OrderId } from './Order';
import type { Receipt, ReceiptId } from './Receipt';
import type { UserPartnerEmail, UserPartnerEmailId } from './UserPartnerEmail';
import type { UserPartnerMap, UserPartnerMapId } from './UserPartnerMap';
import { Deviz, DevizId } from './Deviz';

export interface PartnerAttributes {
  partner_id: number;
  deviz_id?: number;
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
  type?: "Client" | "Transportator" | "Prospect";
}

export type PartnerPk = "partner_id";
export type PartnerId = Partner[PartnerPk];
export type PartnerOptionalAttributes = "partner_id" | "deviz_id" | "credit" | "remaining_credit" | "invoice_deadline_days" | "credit_exceedance_percentage" | "created_at_utc" | "modified_at_utc" | "address" | "type";
export type PartnerCreationAttributes = Optional<PartnerAttributes, PartnerOptionalAttributes>;

export class Partner extends Model<PartnerAttributes, PartnerCreationAttributes> implements PartnerAttributes {
  partner_id!: number;
  deviz_id?: number;
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
  type?: "Client" | "Transportator" | "Prospect";

  // Partner hasMany Deviz via partner_id
  Devize!: Deviz[];
  getDevize!: Sequelize.HasManyGetAssociationsMixin<Deviz>;
  setDevize!: Sequelize.HasManySetAssociationsMixin<Deviz, DevizId>;
  addDeviz!: Sequelize.HasManyAddAssociationMixin<Deviz, DevizId>;
  createDeviz!: Sequelize.HasManyCreateAssociationMixin<Deviz>;
  removeDeviz!: Sequelize.HasManyRemoveAssociationMixin<Deviz, DevizId>;
  hasDeviz!: Sequelize.HasManyHasAssociationMixin<Deviz, DevizId>;
  countDevize!: Sequelize.HasManyCountAssociationsMixin;
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
  // Partner hasMany Order via buyer_id
  Orders!: Order[];
  getOrders!: Sequelize.HasManyGetAssociationsMixin<Order>;
  setOrders!: Sequelize.HasManySetAssociationsMixin<Order, OrderId>;
  addOrder!: Sequelize.HasManyAddAssociationMixin<Order, OrderId>;
  addOrders!: Sequelize.HasManyAddAssociationsMixin<Order, OrderId>;
  createOrder!: Sequelize.HasManyCreateAssociationMixin<Order>;
  removeOrder!: Sequelize.HasManyRemoveAssociationMixin<Order, OrderId>;
  removeOrders!: Sequelize.HasManyRemoveAssociationsMixin<Order, OrderId>;
  hasOrder!: Sequelize.HasManyHasAssociationMixin<Order, OrderId>;
  hasOrders!: Sequelize.HasManyHasAssociationsMixin<Order, OrderId>;
  countOrders!: Sequelize.HasManyCountAssociationsMixin;
  // Partner hasMany Order via client_id
  client_Orders!: Order[];
  getClient_Orders!: Sequelize.HasManyGetAssociationsMixin<Order>;
  setClient_Orders!: Sequelize.HasManySetAssociationsMixin<Order, OrderId>;
  addClient_Order!: Sequelize.HasManyAddAssociationMixin<Order, OrderId>;
  addClient_Orders!: Sequelize.HasManyAddAssociationsMixin<Order, OrderId>;
  createClient_Order!: Sequelize.HasManyCreateAssociationMixin<Order>;
  removeClient_Order!: Sequelize.HasManyRemoveAssociationMixin<Order, OrderId>;
  removeClient_Orders!: Sequelize.HasManyRemoveAssociationsMixin<Order, OrderId>;
  hasClient_Order!: Sequelize.HasManyHasAssociationMixin<Order, OrderId>;
  hasClient_Orders!: Sequelize.HasManyHasAssociationsMixin<Order, OrderId>;
  countClient_Orders!: Sequelize.HasManyCountAssociationsMixin;
  // Partner hasMany Order via transporter_id
  transporter_Orders!: Order[];
  getTransporter_Orders!: Sequelize.HasManyGetAssociationsMixin<Order>;
  setTransporter_Orders!: Sequelize.HasManySetAssociationsMixin<Order, OrderId>;
  addTransporter_Order!: Sequelize.HasManyAddAssociationMixin<Order, OrderId>;
  addTransporter_Orders!: Sequelize.HasManyAddAssociationsMixin<Order, OrderId>;
  createTransporter_Order!: Sequelize.HasManyCreateAssociationMixin<Order>;
  removeTransporter_Order!: Sequelize.HasManyRemoveAssociationMixin<Order, OrderId>;
  removeTransporter_Orders!: Sequelize.HasManyRemoveAssociationsMixin<Order, OrderId>;
  hasTransporter_Order!: Sequelize.HasManyHasAssociationMixin<Order, OrderId>;
  hasTransporter_Orders!: Sequelize.HasManyHasAssociationsMixin<Order, OrderId>;
  countTransporter_Orders!: Sequelize.HasManyCountAssociationsMixin;
  // Partner hasMany Receipt via buyer_partner_id
  Receipts!: Receipt[];
  getReceipts!: Sequelize.HasManyGetAssociationsMixin<Receipt>;
  setReceipts!: Sequelize.HasManySetAssociationsMixin<Receipt, ReceiptId>;
  addReceipt!: Sequelize.HasManyAddAssociationMixin<Receipt, ReceiptId>;
  addReceipts!: Sequelize.HasManyAddAssociationsMixin<Receipt, ReceiptId>;
  createReceipt!: Sequelize.HasManyCreateAssociationMixin<Receipt>;
  removeReceipt!: Sequelize.HasManyRemoveAssociationMixin<Receipt, ReceiptId>;
  removeReceipts!: Sequelize.HasManyRemoveAssociationsMixin<Receipt, ReceiptId>;
  hasReceipt!: Sequelize.HasManyHasAssociationMixin<Receipt, ReceiptId>;
  hasReceipts!: Sequelize.HasManyHasAssociationsMixin<Receipt, ReceiptId>;
  countReceipts!: Sequelize.HasManyCountAssociationsMixin;
  // Partner hasMany Receipt via seller_partner_id
  seller_partner_Receipts!: Receipt[];
  getSeller_partner_Receipts!: Sequelize.HasManyGetAssociationsMixin<Receipt>;
  setSeller_partner_Receipts!: Sequelize.HasManySetAssociationsMixin<Receipt, ReceiptId>;
  addSeller_partner_Receipt!: Sequelize.HasManyAddAssociationMixin<Receipt, ReceiptId>;
  addSeller_partner_Receipts!: Sequelize.HasManyAddAssociationsMixin<Receipt, ReceiptId>;
  createSeller_partner_Receipt!: Sequelize.HasManyCreateAssociationMixin<Receipt>;
  removeSeller_partner_Receipt!: Sequelize.HasManyRemoveAssociationMixin<Receipt, ReceiptId>;
  removeSeller_partner_Receipts!: Sequelize.HasManyRemoveAssociationsMixin<Receipt, ReceiptId>;
  hasSeller_partner_Receipt!: Sequelize.HasManyHasAssociationMixin<Receipt, ReceiptId>;
  hasSeller_partner_Receipts!: Sequelize.HasManyHasAssociationsMixin<Receipt, ReceiptId>;
  countSeller_partner_Receipts!: Sequelize.HasManyCountAssociationsMixin;
  // Partner hasMany UserPartnerEmail via partner_id
  UserPartnerEmails!: UserPartnerEmail[];
  getUserPartnerEmails!: Sequelize.HasManyGetAssociationsMixin<UserPartnerEmail>;
  setUserPartnerEmails!: Sequelize.HasManySetAssociationsMixin<UserPartnerEmail, UserPartnerEmailId>;
  addUserPartnerEmail!: Sequelize.HasManyAddAssociationMixin<UserPartnerEmail, UserPartnerEmailId>;
  addUserPartnerEmails!: Sequelize.HasManyAddAssociationsMixin<UserPartnerEmail, UserPartnerEmailId>;
  createUserPartnerEmail!: Sequelize.HasManyCreateAssociationMixin<UserPartnerEmail>;
  removeUserPartnerEmail!: Sequelize.HasManyRemoveAssociationMixin<UserPartnerEmail, UserPartnerEmailId>;
  removeUserPartnerEmails!: Sequelize.HasManyRemoveAssociationsMixin<UserPartnerEmail, UserPartnerEmailId>;
  hasUserPartnerEmail!: Sequelize.HasManyHasAssociationMixin<UserPartnerEmail, UserPartnerEmailId>;
  hasUserPartnerEmails!: Sequelize.HasManyHasAssociationsMixin<UserPartnerEmail, UserPartnerEmailId>;
  countUserPartnerEmails!: Sequelize.HasManyCountAssociationsMixin;
  // Partner hasMany UserPartnerMap via partner_id
  UserPartnerMaps!: UserPartnerMap[];
  getUserPartnerMaps!: Sequelize.HasManyGetAssociationsMixin<UserPartnerMap>;
  setUserPartnerMaps!: Sequelize.HasManySetAssociationsMixin<UserPartnerMap, UserPartnerMapId>;
  addUserPartnerMap!: Sequelize.HasManyAddAssociationMixin<UserPartnerMap, UserPartnerMapId>;
  addUserPartnerMaps!: Sequelize.HasManyAddAssociationsMixin<UserPartnerMap, UserPartnerMapId>;
  createUserPartnerMap!: Sequelize.HasManyCreateAssociationMixin<UserPartnerMap>;
  removeUserPartnerMap!: Sequelize.HasManyRemoveAssociationMixin<UserPartnerMap, UserPartnerMapId>;
  removeUserPartnerMaps!: Sequelize.HasManyRemoveAssociationsMixin<UserPartnerMap, UserPartnerMapId>;
  hasUserPartnerMap!: Sequelize.HasManyHasAssociationMixin<UserPartnerMap, UserPartnerMapId>;
  hasUserPartnerMaps!: Sequelize.HasManyHasAssociationsMixin<UserPartnerMap, UserPartnerMapId>;
  countUserPartnerMaps!: Sequelize.HasManyCountAssociationsMixin;

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
        type: DataTypes.DECIMAL(19, 4),
        allowNull: false,
        defaultValue: 0
      },
      remaining_credit: {
        type: DataTypes.DECIMAL(19, 4),
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
        defaultValue: Sequelize.Sequelize.literal("(now() AT TIME ZONE 'utc'::text)")
      },
      modified_at_utc: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.Sequelize.literal("(now() AT TIME ZONE 'utc'::text)")
      },
      address: {
        type: DataTypes.STRING,
        allowNull: true
      },
      type: {
        type: DataTypes.ENUM("Client", "Transportator", "Prospect"),
        allowNull: true
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
