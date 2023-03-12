import {sequelize} from "../db/sequelize";
import {Address, AddressAttributes, BankAccount, Contact, initModels, Partner,} from "../db/models/init-models";
import {CreateAddressDto, CreateBankAccountDto, CreateContactDto, CreatePartnerDto,} from "../dtos/create.partner.dto";
import {addOrUpdate} from "./utils.service";
import {Op} from "sequelize";
import {getDateRangeQuery, getLikeQuery,} from "../common/utils/query-utils.service";
import {UpdateAddressDto, UpdateBankAccountDto, UpdateContactDto,} from "../dtos/update.partner.dto";

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
        {model: Address, as: "Addresses"},
        {model: BankAccount, as: "BankAccounts"},
        {model: Contact, as: "Contacts"},
      ],
    });

    partners.forEach((partner: Partner) => {
      partner.get().created_at_utc.toLocaleString();
    });

    return partners;
  }

  async getPartnerAutocompleteOptions(searchKey: string) {
    const models = initModels(sequelize);

    let partners: Partner[] = [];

    try {
      partners = await models.Partner.findAll({
          where: {
            name: getLikeQuery(searchKey)
          },
        }
      )
    } catch (err) {
      console.error(err);
    }

    return partners.map((partner: Partner) => ({
      partner_id: partner.partner_id,
      partner_name: partner.name
    }))

  }

  async getPartner(id: number) {
    const models = initModels(sequelize);

    const partner = (
      await models.Partner.findOne({
        where: {
          partner_id: id,
        },
        include: [
          {model: Address, as: "Addresses"},
          {model: BankAccount, as: "BankAccounts"},
          {model: Contact, as: "Contacts"},
        ],
      })
    )?.get();

    if (!partner) {
      return {errorCode: 404, message: `No partner found for id ${id}`};
    }

    return partner;
  }

  async getPartnerAddressOptions(searchKey: string) {
    const models = initModels(sequelize);

    let partnerAddresses: Address[];

    try {
      partnerAddresses = await models.Address.findAll({
        where: {
          nickname: getLikeQuery(searchKey)
        }
      })
    } catch (err) {
      console.error(err);
    }

    return partnerAddresses.map((partnerAddress: AddressAttributes) => ({
      nickname: partnerAddress.nickname,
      address: partnerAddress.address,
      address_id: partnerAddress.address_id,
      partner_id: partnerAddress.partner_id
    }))
  }

  async getFilteredPartners(queryParams: any) {
    const models = initModels(sequelize);

    const queryObject = {} as any;

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

    return await models.Partner.findAll({
      where: {
        [Op.and]: {
          ...queryObject,
        },
      },
    });
  }

  async updatePartnerAddresses(addresses: UpdateAddressDto[]) {
    const models = initModels(sequelize);

    let existingAddress: UpdateAddressDto = {} as UpdateAddressDto;

    return await Promise.all(
      addresses.map(async (address: UpdateAddressDto) => {
        existingAddress = await models.Address.findOne({
          where: {
            address_id: address.address_id,
            partner_id: address.partner_id,
          },
        });

        if (!existingAddress) {
          return;
        }

        address.partner_id = existingAddress.partner_id;
        address.address_id = existingAddress.address_id;

        await models.Address.update(address, {
          where: {
            address_id: address.address_id,
            partner_id: address.partner_id,
          },
          returning: true,
        });

        return address;
      })
    );
  }

  async updatePartnerContacts(contacts: UpdateContactDto[]) {
    const models = initModels(sequelize);

    let existingContact: UpdateContactDto = {} as UpdateContactDto;

    return await Promise.all(
      contacts.map(async (contact: UpdateContactDto) => {
        existingContact = await models.Contact.findOne({
          where: {
            contact_id: contact.contact_id,
            partner_id: contact.partner_id,
          },
        });

        if (!existingContact) {
          return;
        }

        contact.partner_id = existingContact.partner_id;
        contact.contact_id = existingContact.contact_id;

        await models.Contact.update(contact, {
          where: {
            contact_id: contact.contact_id,
            partner_id: contact.partner_id,
          },
          returning: true,
        });

        return contact;
      })
    );
  }

  async updatePartnerBankAccounts(bankAccounts: UpdateBankAccountDto[]) {
    const models = initModels(sequelize);

    let existingBankAccount: UpdateBankAccountDto = {} as UpdateBankAccountDto;

    return await Promise.all(
      bankAccounts.map(async (bankAccount: UpdateBankAccountDto) => {
        existingBankAccount = await models.BankAccount.findOne({
          where: {
            bank_account_id: bankAccount.bank_account_id,
            partner_id: bankAccount.partner_id,
          },
        });

        if (!existingBankAccount) {
          return;
        }

        await models.BankAccount.update(bankAccount, {
          where: {
            bank_account_id: bankAccount.bank_account_id,
            partner_id: bankAccount.partner_id,
          },
          returning: true,
        });

        return bankAccount;
      })
    );
  }

  async getPartnerByTin(tin: string) {
    const models = initModels(sequelize);

    return (await models.Partner.findOne({
      where: {
        unique_identification_number: tin
      }
    }));
  }

  async addPartnerAddress(addressToAdd: CreateAddressDto) {
    const models = initModels(sequelize);

    return await models.Address.create(addressToAdd);
  }

  async addPartnerBankAccount(bankAccount: CreateBankAccountDto) {
    const models = initModels(sequelize);

    return await models.BankAccount.create(bankAccount);
  }
}

export default new PartnerService();
