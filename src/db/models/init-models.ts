import type { Sequelize } from "sequelize";
import { Address as _Address } from "./Address";
import type { AddressAttributes, AddressCreationAttributes } from "./Address";
import { AutoFleet as _AutoFleet } from "./AutoFleet";
import type { AutoFleetAttributes, AutoFleetCreationAttributes } from "./AutoFleet";
import { BankAccount as _BankAccount } from "./BankAccount";
import type { BankAccountAttributes, BankAccountCreationAttributes } from "./BankAccount";
import { BankRegister as _BankRegister } from "./BankRegister";
import type { BankRegisterAttributes, BankRegisterCreationAttributes } from "./BankRegister";
import { CashRegister as _CashRegister } from "./CashRegister";
import type { CashRegisterAttributes, CashRegisterCreationAttributes } from "./CashRegister";
import { Contact as _Contact } from "./Contact";
import type { ContactAttributes, ContactCreationAttributes } from "./Contact";
import { Employee as _Employee } from "./Employee";
import type { EmployeeAttributes, EmployeeCreationAttributes } from "./Employee";
import { ImageFiles as _ImageFiles } from "./ImageFiles";
import type { ImageFilesAttributes, ImageFilesCreationAttributes } from "./ImageFiles";
import { Invoice as _Invoice } from "./Invoice";
import type { InvoiceAttributes, InvoiceCreationAttributes } from "./Invoice";
import { InvoiceProduct as _InvoiceProduct } from "./InvoiceProduct";
import type { InvoiceProductAttributes, InvoiceProductCreationAttributes } from "./InvoiceProduct";
import { Order as _Order } from "./Order";
import type { OrderAttributes, OrderCreationAttributes } from "./Order";
import { OrderDetails as _OrderDetails } from "./OrderDetails";
import type { OrderDetailsAttributes, OrderDetailsCreationAttributes } from "./OrderDetails";
import { Partner as _Partner } from "./Partner";
import type { PartnerAttributes, PartnerCreationAttributes } from "./Partner";
import { PartnerComment as _PartnerComment } from "./PartnerComment";
import type { PartnerCommentAttributes, PartnerCommentCreationAttributes } from "./PartnerComment";
import { PartnerImage as _PartnerImage } from "./PartnerImage";
import type { PartnerImageAttributes, PartnerImageCreationAttributes } from "./PartnerImage";
import { Product as _Product } from "./Product";
import type { ProductAttributes, ProductCreationAttributes } from "./Product";
import { Receipt as _Receipt } from "./Receipt";
import type { ReceiptAttributes, ReceiptCreationAttributes } from "./Receipt";
import { TimesheetEntry as _TimesheetEntry } from "./TimesheetEntry";
import type { TimesheetEntryAttributes, TimesheetEntryCreationAttributes } from "./TimesheetEntry";
import { User as _User } from "./User";
import type { UserAttributes, UserCreationAttributes } from "./User";
import { UserInvoiceSeries as _UserInvoiceSeries } from "./UserInvoiceSeries";
import type { UserInvoiceSeriesAttributes, UserInvoiceSeriesCreationAttributes } from "./UserInvoiceSeries";
import { UserPartnerEmail as _UserPartnerEmail } from "./UserPartnerEmail";
import type { UserPartnerEmailAttributes, UserPartnerEmailCreationAttributes } from "./UserPartnerEmail";
import { UserPartnerMap as _UserPartnerMap } from "./UserPartnerMap";
import type { UserPartnerMapAttributes, UserPartnerMapCreationAttributes } from "./UserPartnerMap";
import { UserRoles as _UserRoles } from "./UserRoles";
import type { UserRolesAttributes, UserRolesCreationAttributes } from "./UserRoles";
import { UserVehicle as _UserVehicle } from "./UserVehicle";
import type { UserVehicleAttributes, UserVehicleCreationAttributes } from "./UserVehicle";
import { Nc8Code as _Nc8Code } from "./Nc8Code";
import type { Nc8CodeAttributes, Nc8CodeCreationAttributes } from "./Nc8Code";
import { Deviz as _Deviz } from "./Deviz";
import { DevizAttributes, DevizCreationAttributes } from "./Deviz";

export {
  _Address as Address,
  _AutoFleet as AutoFleet,
  _BankAccount as BankAccount,
  _BankRegister as BankRegister,
  _CashRegister as CashRegister,
  _Contact as Contact,
  _Employee as Employee,
  _ImageFiles as ImageFiles,
  _Invoice as Invoice,
  _InvoiceProduct as InvoiceProduct,
  _Order as Order,
  _OrderDetails as OrderDetails,
  _Partner as Partner,
  _PartnerComment as PartnerComment,
  _PartnerImage as PartnerImage,
  _Product as Product,
  _Receipt as Receipt,
  _TimesheetEntry as TimesheetEntry,
  _User as User,
  _UserInvoiceSeries as UserInvoiceSeries,
  _UserPartnerEmail as UserPartnerEmail,
  _UserPartnerMap as UserPartnerMap,
  _UserRoles as UserRoles,
  _UserVehicle as UserVehicle,
  _Nc8Code as Nc8Code,
  _Deviz as Deviz
};

export type {
  AddressAttributes,
  AddressCreationAttributes,
  AutoFleetAttributes,
  AutoFleetCreationAttributes,
  BankAccountAttributes,
  BankAccountCreationAttributes,
  BankRegisterAttributes,
  BankRegisterCreationAttributes,
  CashRegisterAttributes,
  CashRegisterCreationAttributes,
  ContactAttributes,
  ContactCreationAttributes,
  EmployeeAttributes,
  EmployeeCreationAttributes,
  ImageFilesAttributes,
  ImageFilesCreationAttributes,
  InvoiceAttributes,
  InvoiceCreationAttributes,
  InvoiceProductAttributes,
  InvoiceProductCreationAttributes,
  OrderAttributes,
  OrderCreationAttributes,
  OrderDetailsAttributes,
  OrderDetailsCreationAttributes,
  PartnerAttributes,
  PartnerCreationAttributes,
  PartnerCommentAttributes,
  PartnerCommentCreationAttributes,
  PartnerImageAttributes,
  PartnerImageCreationAttributes,
  ProductAttributes,
  ProductCreationAttributes,
  ReceiptAttributes,
  ReceiptCreationAttributes,
  TimesheetEntryAttributes,
  TimesheetEntryCreationAttributes,
  UserAttributes,
  UserCreationAttributes,
  UserInvoiceSeriesAttributes,
  UserInvoiceSeriesCreationAttributes,
  UserPartnerEmailAttributes,
  UserPartnerEmailCreationAttributes,
  UserPartnerMapAttributes,
  UserPartnerMapCreationAttributes,
  UserRolesAttributes,
  UserRolesCreationAttributes,
  UserVehicleAttributes,
  UserVehicleCreationAttributes,
  Nc8CodeAttributes,
  Nc8CodeCreationAttributes,
  DevizAttributes,
  DevizCreationAttributes
};

export function initModels(sequelize: Sequelize) {
  const Address = _Address.initModel(sequelize);
  const AutoFleet = _AutoFleet.initModel(sequelize);
  const BankAccount = _BankAccount.initModel(sequelize);
  const BankRegister = _BankRegister.initModel(sequelize);
  const CashRegister = _CashRegister.initModel(sequelize);
  const Contact = _Contact.initModel(sequelize);
  const Employee = _Employee.initModel(sequelize);
  const ImageFiles = _ImageFiles.initModel(sequelize);
  const Invoice = _Invoice.initModel(sequelize);
  const InvoiceProduct = _InvoiceProduct.initModel(sequelize);
  const Order = _Order.initModel(sequelize);
  const OrderDetails = _OrderDetails.initModel(sequelize);
  const Partner = _Partner.initModel(sequelize);
  const PartnerComment = _PartnerComment.initModel(sequelize);
  const PartnerImage = _PartnerImage.initModel(sequelize);
  const Product = _Product.initModel(sequelize);
  const Receipt = _Receipt.initModel(sequelize);
  const TimesheetEntry = _TimesheetEntry.initModel(sequelize);
  const User = _User.initModel(sequelize);
  const UserInvoiceSeries = _UserInvoiceSeries.initModel(sequelize);
  const UserPartnerEmail = _UserPartnerEmail.initModel(sequelize);
  const UserPartnerMap = _UserPartnerMap.initModel(sequelize);
  const UserRoles = _UserRoles.initModel(sequelize);
  const UserVehicle = _UserVehicle.initModel(sequelize);
  const Nc8Code = _Nc8Code.initModel(sequelize);
  const Deviz = _Deviz.initModel(sequelize);

  Invoice.belongsTo(Address, { as: "drop_off_address", foreignKey: "drop_off_address_id" });
  Address.hasMany(Invoice, { as: "Invoices", foreignKey: "drop_off_address_id" });
  Invoice.belongsTo(Address, { as: "pickup_address", foreignKey: "pickup_address_id" });
  Address.hasMany(Invoice, { as: "pickup_address_Invoices", foreignKey: "pickup_address_id" });
  TimesheetEntry.belongsTo(Address, { as: "address", foreignKey: "address_id" });
  Address.hasMany(TimesheetEntry, { as: "TimesheetEntries", foreignKey: "address_id" });
  UserVehicle.belongsTo(AutoFleet, { as: "vehicle", foreignKey: "vehicle_id" });
  AutoFleet.hasMany(UserVehicle, { as: "UserVehicles", foreignKey: "vehicle_id" });
  Receipt.belongsTo(BankRegister, { as: "bank_register", foreignKey: "bank_register_id" });
  BankRegister.hasMany(Receipt, { as: "Receipts", foreignKey: "bank_register_id" });
  Receipt.belongsTo(CashRegister, { as: "cash_register", foreignKey: "cash_register_id" });
  CashRegister.hasMany(Receipt, { as: "Receipts", foreignKey: "cash_register_id" });
  TimesheetEntry.belongsTo(Employee, { as: "employee", foreignKey: "employee_id" });
  Employee.hasMany(TimesheetEntry, { as: "TimesheetEntries", foreignKey: "employee_id" });
  PartnerImage.belongsTo(ImageFiles, { as: "image", foreignKey: "image_id" });
  ImageFiles.hasMany(PartnerImage, { as: "PartnerImages", foreignKey: "image_id" });
  InvoiceProduct.belongsTo(Invoice, { as: "invoice", foreignKey: "invoice_id" });
  Invoice.hasMany(InvoiceProduct, { as: "InvoiceProducts", foreignKey: "invoice_id" });
  Receipt.belongsTo(Invoice, { as: "invoice", foreignKey: "invoice_id" });
  Invoice.hasMany(Receipt, { as: "Receipts", foreignKey: "invoice_id" });
  Invoice.belongsTo(Order, { as: "order_reference", foreignKey: "order_reference_id" });
  Order.hasMany(Invoice, { as: "Invoices", foreignKey: "order_reference_id" });
  OrderDetails.belongsTo(Order, { as: "order", foreignKey: "order_id" });
  Order.hasMany(OrderDetails, { as: "OrderDetails", foreignKey: "order_id" });
  Address.belongsTo(Partner, { as: "partner", foreignKey: "partner_id" });
  Partner.hasMany(Address, { as: "Addresses", foreignKey: "partner_id" });
  AutoFleet.belongsTo(Partner, { as: "partner", foreignKey: "partner_id" });
  Partner.hasMany(AutoFleet, { as: "AutoFleets", foreignKey: "partner_id" });
  BankAccount.belongsTo(Partner, { as: "partner", foreignKey: "partner_id" });
  Partner.hasMany(BankAccount, { as: "BankAccounts", foreignKey: "partner_id" });
  BankRegister.belongsTo(Partner, { as: "partner", foreignKey: "partner_id" });
  Partner.hasMany(BankRegister, { as: "BankRegisters", foreignKey: "partner_id" });
  CashRegister.belongsTo(Partner, { as: "partner", foreignKey: "partner_id" });
  Partner.hasMany(CashRegister, { as: "CashRegisters", foreignKey: "partner_id" });
  Contact.belongsTo(Partner, { as: "partner", foreignKey: "partner_id" });
  Partner.hasMany(Contact, { as: "Contacts", foreignKey: "partner_id" });
  Employee.belongsTo(Partner, { as: "partner", foreignKey: "partner_id" });
  Partner.hasMany(Employee, { as: "Employees", foreignKey: "partner_id" });
  Invoice.belongsTo(Partner, { as: "buyer", foreignKey: "buyer_id" });
  Partner.hasMany(Invoice, { as: "Invoices", foreignKey: "buyer_id" });
  Invoice.belongsTo(Partner, { as: "client", foreignKey: "client_id" });
  Partner.hasMany(Invoice, { as: "client_Invoices", foreignKey: "client_id" });
  Order.belongsTo(Partner, { as: "buyer", foreignKey: "buyer_id" });
  Partner.hasMany(Order, { as: "Orders", foreignKey: "buyer_id" });
  Order.belongsTo(Partner, { as: "client", foreignKey: "client_id" });
  Partner.hasMany(Order, { as: "client_Orders", foreignKey: "client_id" });
  Order.belongsTo(Partner, { as: "transporter", foreignKey: "transporter_id" });
  Partner.hasMany(Order, { as: "transporter_Orders", foreignKey: "transporter_id" });
  PartnerComment.belongsTo(Partner, { as: "partner", foreignKey: "partner_id" });
  Partner.hasMany(PartnerComment, { as: "PartnerComments", foreignKey: "partner_id" });
  PartnerImage.belongsTo(Partner, { as: "partner", foreignKey: "partner_id" });
  Partner.hasMany(PartnerImage, { as: "PartnerImages", foreignKey: "partner_id" });
  Receipt.belongsTo(Partner, { as: "buyer_partner", foreignKey: "buyer_partner_id" });
  Partner.hasMany(Receipt, { as: "Receipts", foreignKey: "buyer_partner_id" });
  Receipt.belongsTo(Partner, { as: "seller_partner", foreignKey: "seller_partner_id" });
  Partner.hasMany(Receipt, { as: "seller_partner_Receipts", foreignKey: "seller_partner_id" });
  UserPartnerEmail.belongsTo(Partner, { as: "partner", foreignKey: "partner_id" });
  Partner.hasMany(UserPartnerEmail, { as: "UserPartnerEmails", foreignKey: "partner_id" });
  UserPartnerMap.belongsTo(Partner, { as: "partner", foreignKey: "partner_id" });
  Partner.hasMany(UserPartnerMap, { as: "UserPartnerMaps", foreignKey: "partner_id" });
  InvoiceProduct.belongsTo(Product, { as: "product", foreignKey: "product_id" });
  Product.hasMany(InvoiceProduct, { as: "InvoiceProducts", foreignKey: "product_id" });
  Invoice.belongsTo(User, { as: "user", foreignKey: "user_id" });
  User.hasMany(Invoice, { as: "Invoices", foreignKey: "user_id" });
  Order.belongsTo(User, { as: "user", foreignKey: "user_id" });
  User.hasMany(Order, { as: "Orders", foreignKey: "user_id" });
  PartnerComment.belongsTo(User, { as: "user", foreignKey: "user_id" });
  User.hasMany(PartnerComment, { as: "PartnerComments", foreignKey: "user_id" });
  UserInvoiceSeries.belongsTo(User, { as: "user", foreignKey: "user_id" });
  User.hasMany(UserInvoiceSeries, { as: "UserInvoiceSeries", foreignKey: "user_id" });
  UserPartnerEmail.belongsTo(User, { as: "user", foreignKey: "user_id" });
  User.hasMany(UserPartnerEmail, { as: "UserPartnerEmails", foreignKey: "user_id" });
  UserPartnerMap.belongsTo(User, { as: "user", foreignKey: "user_id" });
  User.hasMany(UserPartnerMap, { as: "UserPartnerMaps", foreignKey: "user_id" });
  UserRoles.belongsTo(User, { as: "user", foreignKey: "user_id" });
  User.hasMany(UserRoles, { as: "UserRoles", foreignKey: "user_id" });
  UserVehicle.belongsTo(User, { as: "user", foreignKey: "user_id" });
  User.hasMany(UserVehicle, { as: "UserVehicles", foreignKey: "user_id" });
  Product.belongsTo(Nc8Code, { as: "nc8Code", foreignKey: "nc8_code_id" });
  Nc8Code.hasMany(Product, { as: "products", foreignKey: "nc8_code_id" });
  // Devize
  Deviz.belongsTo(AutoFleet, { as: "AutoFleet", foreignKey: "auto_fleet_id" });
  Deviz.belongsTo(Partner, { as: "Partner", foreignKey: "partner_id" });
  Partner.hasMany(Deviz, { as: "Devize", foreignKey: "deviz_id" })
  AutoFleet.hasMany(Deviz, { as: "Devize", foreignKey: "deviz_id" })

  return {
    Address: Address,
    AutoFleet: AutoFleet,
    BankAccount: BankAccount,
    BankRegister: BankRegister,
    CashRegister: CashRegister,
    Contact: Contact,
    Employee: Employee,
    ImageFiles: ImageFiles,
    Invoice: Invoice,
    InvoiceProduct: InvoiceProduct,
    Order: Order,
    OrderDetails: OrderDetails,
    Partner: Partner,
    PartnerComment: PartnerComment,
    PartnerImage: PartnerImage,
    Product: Product,
    Receipt: Receipt,
    TimesheetEntry: TimesheetEntry,
    User: User,
    UserInvoiceSeries: UserInvoiceSeries,
    UserPartnerEmail: UserPartnerEmail,
    UserPartnerMap: UserPartnerMap,
    UserRoles: UserRoles,
    UserVehicle: UserVehicle,
    Nc8Code: Nc8Code,
    Deviz: Deviz
  };
}
