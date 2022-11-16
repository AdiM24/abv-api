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
    const contact = models.Contact;
    const address = models.Address;
    const bankAccount = models.BankAccount;

    try {
      let addressId: number = null;
      let bankAccountId: number = null;

      if (partnerToAdd.contact) {
        partnerToAdd.contact_id = (
          await addOrUpdate<CreateContactDto, Contact>(
            partnerToAdd.contact,
            {
              personal_identification_number:
                partnerToAdd.contact.personal_identification_number,
            },
            contact,
            () => {
              partnerToAdd.contact.modified_at_utc = new Date(
                new Date().toUTCString()
              );
            }
          )
        )?.get().contact_id;
      }

      if (partnerToAdd.address) {
        addressId = (
          await addOrUpdate<CreateAddressDto, Address>(
            partnerToAdd.address,
            {
              address: partnerToAdd.address.address,
            },
            address,
            () => {
              partnerToAdd.address.modified_at_utc = new Date(
                new Date().toUTCString()
              );
            }
          )
        ).get().address_id;
      }

      if (partnerToAdd.bank_account) {
        bankAccountId = (
          await addOrUpdate<CreateBankAccountDto, BankAccount>(
            partnerToAdd.bank_account,
            {
              iban: partnerToAdd.bank_account.iban,
            },
            bankAccount,
            () => {
              partnerToAdd.address.modified_at_utc = new Date(
                new Date().toUTCString()
              );
            }
          )
        )?.get().bank_account_id;
      }

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

      if (bankAccountId) {
        models.PartnerBankAccountMap.findOrCreate({
          where: {
            bank_account_id: bankAccountId,
            partner_id: createdPartnerId,
          },
          defaults: {
            bank_account_id: bankAccountId,
            partner_id: createdPartnerId,
          },
        });
      }

      if (addressId) {
        models.PartnerAddressMap.findOrCreate({
          where: {
            address_id: addressId,
            partner_id: createdPartnerId,
          },
          defaults: {
            address_id: addressId,
            partner_id: createdPartnerId,
          },
        });
      }
    } catch (err) {
      console.error(err);
    }
  }
}

export default new PartnerService();
