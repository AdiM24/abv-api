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

      if (partnerToAdd.contact) {
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

      if (partnerToAdd.address) {
        const address = partnerToAdd.address;
        address.partner_id = createdPartnerId;

        await addOrUpdate<CreateAddressDto, Address>(
          partnerToAdd.address,
          {
            address: partnerToAdd.address.address,
          },
          addressEntity,
          () => {
            partnerToAdd.address.modified_at_utc = new Date(
              new Date().toUTCString()
            );
          }
        );
      }

      if (partnerToAdd.bank_account) {
        const bankAccount = partnerToAdd.bank_account;
        bankAccount.partner_id = createdPartnerId;

        await addOrUpdate<CreateBankAccountDto, BankAccount>(
          partnerToAdd.bank_account,
          {
            iban: partnerToAdd.bank_account.iban,
          },
          bankAccountEntity,
          () => {
            partnerToAdd.address.modified_at_utc = new Date(
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

    const partners = await Partner.findAll({
      include: [
        { model: Address, as: "Addresses" },
        { model: BankAccount, as: "BankAccounts" },
        { model: Contact, as: "Contacts" },
      ],
    });

    return partners;
  }
}

export default new PartnerService();
