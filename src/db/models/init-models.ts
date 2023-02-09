import type { Sequelize } from "sequelize";
import { Address as _Address } from "./Address";
import type { AddressAttributes, AddressCreationAttributes } from "./Address";
import { BankAccount as _BankAccount } from "./BankAccount";
import type { BankAccountAttributes, BankAccountCreationAttributes } from "./BankAccount";
import { Contact as _Contact } from "./Contact";
import type { ContactAttributes, ContactCreationAttributes } from "./Contact";
import { Invoice as _Invoice } from "./Invoice";
import type { InvoiceAttributes, InvoiceCreationAttributes } from "./Invoice";
import { InvoiceProduct as _InvoiceProduct } from "./InvoiceProduct";
import type { InvoiceProductAttributes, InvoiceProductCreationAttributes } from "./InvoiceProduct";
import { Partner as _Partner } from "./Partner";
import type { PartnerAttributes, PartnerCreationAttributes } from "./Partner";
import { Product as _Product } from "./Product";
import type { ProductAttributes, ProductCreationAttributes } from "./Product";
import { User as _User } from "./User";
import type { UserAttributes, UserCreationAttributes } from "./User";

export {
  _Address as Address,
  _BankAccount as BankAccount,
  _Contact as Contact,
  _Invoice as Invoice,
  _InvoiceProduct as InvoiceProduct,
  _Partner as Partner,
  _Product as Product,
  _User as User,
};

export type {
  AddressAttributes,
  AddressCreationAttributes,
  BankAccountAttributes,
  BankAccountCreationAttributes,
  ContactAttributes,
  ContactCreationAttributes,
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
};

export function initModels(sequelize: Sequelize) {
  const Address = _Address.initModel(sequelize);
  const BankAccount = _BankAccount.initModel(sequelize);
  const Contact = _Contact.initModel(sequelize);
  const Invoice = _Invoice.initModel(sequelize);
  const InvoiceProduct = _InvoiceProduct.initModel(sequelize);
  const Partner = _Partner.initModel(sequelize);
  const Product = _Product.initModel(sequelize);
  const User = _User.initModel(sequelize);

  InvoiceProduct.belongsTo(Invoice, { as: "invoice", foreignKey: "invoice_id"});
  Invoice.hasMany(InvoiceProduct, { as: "InvoiceProducts", foreignKey: "invoice_id"});
  Address.belongsTo(Partner, { as: "partner", foreignKey: "partner_id"});
  Partner.hasMany(Address, { as: "Addresses", foreignKey: "partner_id"});
  BankAccount.belongsTo(Partner, { as: "partner", foreignKey: "partner_id"});
  Partner.hasMany(BankAccount, { as: "BankAccounts", foreignKey: "partner_id"});
  Contact.belongsTo(Partner, { as: "partner", foreignKey: "partner_id"});
  Partner.hasMany(Contact, { as: "Contacts", foreignKey: "partner_id"});
  Invoice.belongsTo(Partner, { as: "buyer", foreignKey: "buyer_id"});
  Partner.hasMany(Invoice, { as: "Invoices", foreignKey: "buyer_id"});
  Invoice.belongsTo(Partner, { as: "client", foreignKey: "client_id"});
  Partner.hasMany(Invoice, { as: "client_Invoices", foreignKey: "client_id"});
  InvoiceProduct.belongsTo(Product, { as: "product", foreignKey: "product_id"});
  Product.hasMany(InvoiceProduct, { as: "InvoiceProducts", foreignKey: "product_id"});

  return {
    Address: Address,
    BankAccount: BankAccount,
    Contact: Contact,
    Invoice: Invoice,
    InvoiceProduct: InvoiceProduct,
    Partner: Partner,
    Product: Product,
    User: User,
  };
}
