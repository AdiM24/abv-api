import type {Sequelize} from "sequelize";
import type {AddressAttributes, AddressCreationAttributes} from "./Address";
import {Address as _Address} from "./Address";
import type {BankAccountAttributes, BankAccountCreationAttributes} from "./BankAccount";
import {BankAccount as _BankAccount} from "./BankAccount";
import type {ContactAttributes, ContactCreationAttributes} from "./Contact";
import {Contact as _Contact} from "./Contact";
import type {EmployeeAttributes, EmployeeCreationAttributes} from "./Employee";
import {Employee as _Employee} from "./Employee";
import type {InvoiceAttributes, InvoiceCreationAttributes} from "./Invoice";
import {Invoice as _Invoice} from "./Invoice";
import type {InvoiceProductAttributes, InvoiceProductCreationAttributes} from "./InvoiceProduct";
import {InvoiceProduct as _InvoiceProduct} from "./InvoiceProduct";
import type {PartnerAttributes, PartnerCreationAttributes} from "./Partner";
import {Partner as _Partner} from "./Partner";
import type {ProductAttributes, ProductCreationAttributes} from "./Product";
import {Product as _Product} from "./Product";
import type {UserAttributes, UserCreationAttributes} from "./User";
import {User as _User} from "./User";
import type {UserInvoiceSeriesAttributes, UserInvoiceSeriesCreationAttributes} from "./UserInvoiceSeries";
import {UserInvoiceSeries as _UserInvoiceSeries} from "./UserInvoiceSeries";

export {
  _Address as Address,
  _BankAccount as BankAccount,
  _Contact as Contact,
  _Employee as Employee,
  _Invoice as Invoice,
  _InvoiceProduct as InvoiceProduct,
  _Partner as Partner,
  _Product as Product,
  _User as User,
  _UserInvoiceSeries as UserInvoiceSeries
};

export type {
  AddressAttributes,
  AddressCreationAttributes,
  BankAccountAttributes,
  BankAccountCreationAttributes,
  ContactAttributes,
  ContactCreationAttributes,
  EmployeeAttributes,
  EmployeeCreationAttributes,
  InvoiceAttributes,
  InvoiceCreationAttributes,
  InvoiceProductAttributes,
  InvoiceProductCreationAttributes,
  PartnerAttributes,
  PartnerCreationAttributes,
  ProductAttributes,
  ProductCreationAttributes,
  UserAttributes,
  UserCreationAttributes,
  UserInvoiceSeriesAttributes,
  UserInvoiceSeriesCreationAttributes
};

export function initModels(sequelize: Sequelize) {
  const Address = _Address.initModel(sequelize);
  const BankAccount = _BankAccount.initModel(sequelize);
  const Contact = _Contact.initModel(sequelize);
  const Employee = _Employee.initModel(sequelize);
  const Invoice = _Invoice.initModel(sequelize);
  const InvoiceProduct = _InvoiceProduct.initModel(sequelize);
  const Partner = _Partner.initModel(sequelize);
  const Product = _Product.initModel(sequelize);
  const User = _User.initModel(sequelize);
  const UserInvoiceSeries = _UserInvoiceSeries.initModel(sequelize);

  Invoice.belongsTo(Address, {as: "drop_off_address", foreignKey: "drop_off_address_id"});
  Address.hasMany(Invoice, {as: "Invoices", foreignKey: "drop_off_address_id"});
  Invoice.belongsTo(Address, {as: "pickup_address", foreignKey: "pickup_address_id"});
  Address.hasMany(Invoice, {as: "pickup_address_Invoices", foreignKey: "pickup_address_id"});
  InvoiceProduct.belongsTo(Invoice, {as: "invoice", foreignKey: "invoice_id"});
  Invoice.hasMany(InvoiceProduct, {as: "InvoiceProducts", foreignKey: "invoice_id"});
  Address.belongsTo(Partner, {as: "partner", foreignKey: "partner_id"});
  Partner.hasMany(Address, {as: "Addresses", foreignKey: "partner_id"});
  BankAccount.belongsTo(Partner, {as: "partner", foreignKey: "partner_id"});
  Partner.hasMany(BankAccount, {as: "BankAccounts", foreignKey: "partner_id"});
  Contact.belongsTo(Partner, {as: "partner", foreignKey: "partner_id"});
  Partner.hasMany(Contact, {as: "Contacts", foreignKey: "partner_id"});
  Employee.belongsTo(Partner, {as: "partner", foreignKey: "partner_id"});
  Partner.hasMany(Employee, {as: "Employees", foreignKey: "partner_id"});
  Invoice.belongsTo(Partner, {as: "buyer", foreignKey: "buyer_id"});
  Partner.hasMany(Invoice, {as: "Invoices", foreignKey: "buyer_id"});
  Invoice.belongsTo(Partner, {as: "client", foreignKey: "client_id"});
  Partner.hasMany(Invoice, {as: "client_Invoices", foreignKey: "client_id"});
  InvoiceProduct.belongsTo(Product, {as: "product", foreignKey: "product_id"});
  Product.hasMany(InvoiceProduct, {as: "InvoiceProducts", foreignKey: "product_id"});
  UserInvoiceSeries.belongsTo(User, {as: "user", foreignKey: "user_id"});
  User.hasMany(UserInvoiceSeries, {as: "UserInvoiceSeries", foreignKey: "user_id"});

  return {
    Address: Address,
    BankAccount: BankAccount,
    Contact: Contact,
    Employee: Employee,
    Invoice: Invoice,
    InvoiceProduct: InvoiceProduct,
    Partner: Partner,
    Product: Product,
    User: User,
    UserInvoiceSeries: UserInvoiceSeries,
  };
}
