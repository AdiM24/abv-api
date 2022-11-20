import type { Sequelize } from "sequelize";
import { Address as _Address } from "./Address";
import type { AddressAttributes, AddressCreationAttributes } from "./Address";
import { BankAccount as _BankAccount } from "./BankAccount";
import type { BankAccountAttributes, BankAccountCreationAttributes } from "./BankAccount";
import { Contact as _Contact } from "./Contact";
import type { ContactAttributes, ContactCreationAttributes } from "./Contact";
import { Partner as _Partner } from "./Partner";
import type { PartnerAttributes, PartnerCreationAttributes } from "./Partner";
import { User as _User } from "./User";
import type { UserAttributes, UserCreationAttributes } from "./User";

export {
  _Address as Address,
  _BankAccount as BankAccount,
  _Contact as Contact,
  _Partner as Partner,
  _User as User,
};

export type {
  AddressAttributes,
  AddressCreationAttributes,
  BankAccountAttributes,
  BankAccountCreationAttributes,
  ContactAttributes,
  ContactCreationAttributes,
  PartnerAttributes,
  PartnerCreationAttributes,
  UserAttributes,
  UserCreationAttributes,
};

export function initModels(sequelize: Sequelize) {
  const Address = _Address.initModel(sequelize);
  const BankAccount = _BankAccount.initModel(sequelize);
  const Contact = _Contact.initModel(sequelize);
  const Partner = _Partner.initModel(sequelize);
  const User = _User.initModel(sequelize);

  Address.belongsTo(Partner, { as: "partner", foreignKey: "partner_id"});
  Partner.hasMany(Address, { as: "Addresses", foreignKey: "partner_id"});
  BankAccount.belongsTo(Partner, { as: "partner", foreignKey: "partner_id"});
  Partner.hasMany(BankAccount, { as: "BankAccounts", foreignKey: "partner_id"});
  Contact.belongsTo(Partner, { as: "partner", foreignKey: "partner_id"});
  Partner.hasMany(Contact, { as: "Contacts", foreignKey: "partner_id"});

  return {
    Address: Address,
    BankAccount: BankAccount,
    Contact: Contact,
    Partner: Partner,
    User: User,
  };
}
