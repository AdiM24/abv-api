import type { Sequelize } from "sequelize";
import { Address as _Address } from "./Address";
import type { AddressAttributes, AddressCreationAttributes } from "./Address";
import { BankAccount as _BankAccount } from "./BankAccount";
import type { BankAccountAttributes, BankAccountCreationAttributes } from "./BankAccount";
import { Contact as _Contact } from "./Contact";
import type { ContactAttributes, ContactCreationAttributes } from "./Contact";
import { Partner as _Partner } from "./Partner";
import type { PartnerAttributes, PartnerCreationAttributes } from "./Partner";
import { PartnerAddressMap as _PartnerAddressMap } from "./PartnerAddressMap";
import type { PartnerAddressMapAttributes, PartnerAddressMapCreationAttributes } from "./PartnerAddressMap";
import { PartnerBankAccountMap as _PartnerBankAccountMap } from "./PartnerBankAccountMap";
import type { PartnerBankAccountMapAttributes, PartnerBankAccountMapCreationAttributes } from "./PartnerBankAccountMap";
import { User as _User } from "./User";
import type { UserAttributes, UserCreationAttributes } from "./User";

export {
  _Address as Address,
  _BankAccount as BankAccount,
  _Contact as Contact,
  _Partner as Partner,
  _PartnerAddressMap as PartnerAddressMap,
  _PartnerBankAccountMap as PartnerBankAccountMap,
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
  PartnerAddressMapAttributes,
  PartnerAddressMapCreationAttributes,
  PartnerBankAccountMapAttributes,
  PartnerBankAccountMapCreationAttributes,
  UserAttributes,
  UserCreationAttributes,
};

export function initModels(sequelize: Sequelize) {
  const Address = _Address.initModel(sequelize);
  const BankAccount = _BankAccount.initModel(sequelize);
  const Contact = _Contact.initModel(sequelize);
  const Partner = _Partner.initModel(sequelize);
  const PartnerAddressMap = _PartnerAddressMap.initModel(sequelize);
  const PartnerBankAccountMap = _PartnerBankAccountMap.initModel(sequelize);
  const User = _User.initModel(sequelize);

  PartnerAddressMap.belongsTo(Address, { as: "address", foreignKey: "address_id"});
  Address.hasMany(PartnerAddressMap, { as: "PartnerAddressMaps", foreignKey: "address_id"});
  PartnerBankAccountMap.belongsTo(BankAccount, { as: "bank_account", foreignKey: "bank_account_id"});
  BankAccount.hasMany(PartnerBankAccountMap, { as: "PartnerBankAccountMaps", foreignKey: "bank_account_id"});
  Partner.belongsTo(Contact, { as: "contact", foreignKey: "contact_id"});
  Contact.hasMany(Partner, { as: "Partners", foreignKey: "contact_id"});
  PartnerAddressMap.belongsTo(Partner, { as: "partner", foreignKey: "partner_id"});
  Partner.hasMany(PartnerAddressMap, { as: "PartnerAddressMaps", foreignKey: "partner_id"});
  PartnerBankAccountMap.belongsTo(Partner, { as: "partner", foreignKey: "partner_id"});
  Partner.hasMany(PartnerBankAccountMap, { as: "PartnerBankAccountMaps", foreignKey: "partner_id"});

  return {
    Address: Address,
    BankAccount: BankAccount,
    Contact: Contact,
    Partner: Partner,
    PartnerAddressMap: PartnerAddressMap,
    PartnerBankAccountMap: PartnerBankAccountMap,
    User: User,
  };
}
