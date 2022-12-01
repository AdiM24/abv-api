import { sequelize } from "../db/sequelize";
import {
  Address,
  BankAccount,
  Contact,
  initModels,
  Partner,
} from "../db/models/init-models";
import {
  CreateAddressDto,
  CreateBankAccountDto,
  CreateContactDto,
  CreatePartnerDto,
} from "../dtos/create.partner.dto";
import { addOrUpdate } from "./utils.service";
import { Op } from "sequelize";
import {
  getDateRangeQuery,
  getLikeQuery,
} from "../common/utils/query-utils.service";

class PartnerService {
  async addPartner(partnerToAdd: CreatePartnerDto) {
    const models = initModels(sequelize);
    const partner = models.Partner;
    const contactEntity = models.Contact;
    const addressEntity = models.Address;
    const bankAccountEntity = models.BankAccount;

    try {
      const createdPartnerId = (
        await addOrUpdate<CreatePartnerDto, Partner>(
          partnerToAdd,
          {
            unique_identification_number:
              partnerToAdd.unique_identification_number,
          },
          partner,
          () => {
            partnerToAdd.modified_at_utc = new Date(new Date().toUTCString());
          }
        )
      )?.get().partner_id;

      if (Object.keys(partnerToAdd.contact).length > 0) {
        const contact = partnerToAdd.contact;
        contact.partner_id = createdPartnerId;

        await addOrUpdate<CreateContactDto, Contact>(
          contact,
          {
            personal_identification_number:
              contact.personal_identification_number,
          },
          contactEntity,
          () => {
            partnerToAdd.contact.modified_at_utc = new Date(
              new Date().toUTCString()
            );
          }
        );
      }

      if (Object.keys(partnerToAdd.address)?.length > 0) {
        const address = partnerToAdd.address_point;
        address.partner_id = createdPartnerId;

        await addOrUpdate<CreateAddressDto, Address>(
          partnerToAdd.address_point,
          {
            address: partnerToAdd.address_point.address,
          },
          addressEntity,
          () => {
            partnerToAdd.address_point.modified_at_utc = new Date(
              new Date().toUTCString()
            );
          }
        );
      }

      if (Object.keys(partnerToAdd.bank_account).length > 0) {
        const bankAccount = partnerToAdd.bank_account;
        bankAccount.partner_id = createdPartnerId;

        await addOrUpdate<CreateBankAccountDto, BankAccount>(
          partnerToAdd.bank_account,
          {
            iban: partnerToAdd.bank_account.iban,
          },
          bankAccountEntity,
          () => {
            partnerToAdd.address_point.modified_at_utc = new Date(
              new Date().toUTCString()
            );
          }
        );
      }

      return createdPartnerId;
    } catch (err) {
      console.error(err);
    }
  }

  async getPartners() {
    const models = initModels(sequelize);

    const partners = await models.Partner.findAll({
      include: [
        { model: Address, as: "Addresses" },
        { model: BankAccount, as: "BankAccounts" },
        { model: Contact, as: "Contacts" },
      ],
    });

    partners.forEach((partner: Partner) => {
      partner.get().created_at_utc.toLocaleString();
    });

    return partners;
  }

  async getPartner(id: number) {
    const models = initModels(sequelize);

    const partner = (
      await models.Partner.findOne({
        where: {
          partner_id: id,
        },
        include: [
          { model: Address, as: "Addresses" },
          { model: BankAccount, as: "BankAccounts" },
          { model: Contact, as: "Contacts" },
        ],
      })
    )?.get();

    if (!partner) {
      return `No partner found for id ${id}`;
    }

    return partner;
  }

  async getFilteredPartners(queryParams: any) {
    const models = initModels(sequelize);

    let queryObject = {} as any;

    if (queryParams.created_at_from || queryParams.created_at_to)
      queryObject.created_at_utc = getDateRangeQuery(
        queryParams.created_at_from,
        queryParams.created_at_to
      );

    if (queryParams.name) queryObject.name = getLikeQuery(queryParams.name);

    if (queryParams.unique_identification_number)
      queryObject.unique_identification_number = getLikeQuery(
        queryParams.unique_identification_number
      );

    const partners = await Partner.findAll({
      where: {
        [Op.and]: {
          ...queryObject,
        },
      },
    });

    return partners;
  }
}

export default new PartnerService();
