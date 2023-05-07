import {sequelize} from "../db/sequelize";
import {
  Address,
  AddressAttributes,
  BankAccount,
  Contact,
  initModels,
  Partner,
  User,
  UserPartnerMap,
} from "../db/models/init-models";
import {CreateAddressDto, CreateBankAccountDto, CreateContactDto, CreatePartnerDto,} from "../dtos/create.partner.dto";
import {addOrUpdate} from "./utils.service";
import {Op} from "sequelize";
import {getLikeQuery, getStrictQuery,} from "../common/utils/query-utils.service";
import {UpdateAddressDto, UpdateBankAccountDto, UpdateContactDto, UpdatePartnerDto,} from "../dtos/update.partner.dto";
import UserPartnerMappingService from "./user-partner-mapping.service";
import {PartnerCommentCreationAttributes} from "../db/models/PartnerComment";

class PartnerService {
  async addPartner(partnerToAdd: CreatePartnerDto, decodedToken: any) {
    const models = initModels(sequelize);
    const partner = models.Partner;
    const contactEntity = models.Contact;
    const addressEntity = models.Address;
    const bankAccountEntity = models.BankAccount;

    try {
      if (partnerToAdd.vat_payer) {
        partnerToAdd.unique_identification_number = 'RO' + partnerToAdd.unique_identification_number;
      }

      if (partnerToAdd.is_user_partner) {
        partnerToAdd.user_id = decodedToken._id;
        delete partnerToAdd.is_user_partner;
      }

      const createdPartnerId = (await models.Partner.create(partnerToAdd)).get().partner_id;

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

  async updatePartner(partnerToAdd: UpdatePartnerDto) {
    const models = initModels(sequelize);

    const existingPartner = await models.Partner.findOne({
      where: {
        partner_id: partnerToAdd.partner_id
      }
    });

    existingPartner.modified_at_utc = new Date();

    const actualTin = partnerToAdd.unique_identification_number.split('RO');

    if (partnerToAdd.vat_payer) {
      partnerToAdd.unique_identification_number = `RO${actualTin[actualTin.length - 1]}`
    } else {
      partnerToAdd.unique_identification_number = actualTin[actualTin.length - 1]
    }

    try {
      await existingPartner.update(partnerToAdd);

      await existingPartner.save();
    } catch (error) {
      console.error(error);
    }

    return {code: 200, message: 'Partenerul a fost actualizat'};
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

  async getPartnerAutocompleteOptions(searchKey: string, decodedToken: any = undefined) {
    const models = initModels(sequelize);

    let partners: Partner[] = [];

    try {
      if (decodedToken) {
        const userPartnerIds = await UserPartnerMappingService.getUserPartnerMappings(decodedToken._id);

        partners = await models.Partner.findAll({
          where: {
            name: getLikeQuery(searchKey),
            partner_id: userPartnerIds.map((userPartnerMap: UserPartnerMap) => userPartnerMap.partner_id)
          }
        })
      } else {
        partners = await models.Partner.findAll({
            where: {
              name: getLikeQuery(searchKey)
            },
          }
        )
      }
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

  // Addresses
  async getPartnerAddress(address_id: number) {
    const models = initModels(sequelize);

    return await models.Address.findOne({
      where: {
        address_id: address_id
      },
      raw: true
    });
  }

  async getBankAccount(bank_account_id: number) {
    const models = initModels(sequelize);

    return await models.BankAccount.findOne({
      where: {
        bank_account_id: bank_account_id
      },
      raw: true
    });
  }

  async getPartnerAddressOptions(searchKey: string, decodedJwt: any) {
    const models = initModels(sequelize);

    let partnerAddresses: Address[];

    const userPartnerIds = await UserPartnerMappingService.getUserPartnerMappings(decodedJwt._id);

    const userPartners = await models.Partner.findAll({
      where: {
        partner_id: userPartnerIds.map((userPartnerMap: UserPartnerMap) => userPartnerMap.partner_id)
      }
    });

    try {
      partnerAddresses = await models.Address.findAll({
        where: {
          partner_id: userPartners.map((userPartner: Partner) => userPartner.partner_id),
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

  async updatePartnerAddress(address: UpdateAddressDto) {
    const models = initModels(sequelize);

    const updatedAddress = await models.Address.update(address, {
      where: {
        address_id: address.address_id,
        partner_id: address.partner_id,
      },
      returning: true,
    });

    return updatedAddress;
  }

  async addPartnerAddress(addressToAdd: CreateAddressDto) {
    const models = initModels(sequelize);

    return await models.Address.create(addressToAdd);
  }

  // ---------

  async getFilteredPartners(queryParams: any) {
    const models = initModels(sequelize);

    const queryObject = {} as any;

    if (queryParams.user_id) {
      queryObject.user_id = getStrictQuery(queryParams.user_id);
    }

    if (queryParams.type) {
      queryObject.type = getStrictQuery(queryParams.type);
    }

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

  async addPartnerContact(contactToAdd: CreateContactDto) {
    const models = initModels(sequelize);

    return await models.Contact.create(contactToAdd);
  }

  async updatePartnerContact(contact: UpdateContactDto) {
    const models = initModels(sequelize);

    return await models.Contact.update(contact, {
      where: {
        contact_id: contact.contact_id,
        partner_id: contact.partner_id,
      },
      returning: true,
    });
  }

  async updatePartnerBankAccount(bankAccount: UpdateBankAccountDto) {
    const models = initModels(sequelize);

    const updatedBankAccount = await models.BankAccount.update(bankAccount, {
      where: {
        bank_account_id: bankAccount.bank_account_id,
        partner_id: bankAccount.partner_id,
      },
      returning: true,
    });

    return updatedBankAccount;
  }

  async getPartnerByTin(tin: string) {
    const models = initModels(sequelize);

    return (await models.Partner.findOne({
      where: {
        unique_identification_number: tin
      }
    }));
  }


  async addPartnerBankAccount(bankAccount: CreateBankAccountDto) {
    const models = initModels(sequelize);

    return await models.BankAccount.create(bankAccount);
  }

  async getUniquePartner(partnerId: number, unique: string) {
    const models = initModels(sequelize);

    const existingUser = await models.Partner.findOne({
      where: {
        unique_identification_number: unique,
        [Op.not]: {
          partner_id: partnerId
        }
      }
    });

    return existingUser;
  }

  async getPartnerComments(partner_id: number) {
    const models = initModels(sequelize);

    const partnerComments = await models.PartnerComment.findAll({
      where: {
        partner_id: partner_id
      },
      include: [
        {model: User, as: 'user', attributes: ["first_name", "last_name"]}
      ]
    });

    return partnerComments
  }

  async getPartnerComment(comment_id: number) {
    const models = initModels(sequelize);

    const partnerComment = await models.PartnerComment.findOne({
      where: {
        partner_comment_id: comment_id
      }
    });

    return partnerComment;
  }

  async addPartnerComment(partnerComment: { partner_id: number, comment: string }, decodedJwt: any) {
    const models = initModels(sequelize);

    const partnerCommentToAdd: PartnerCommentCreationAttributes = {
      comment: partnerComment.comment,
      partner_id: partnerComment.partner_id,
      user_id: decodedJwt._id,
      created_at_utc: new Date().toUTCString()
    }

    await models.PartnerComment.create(partnerCommentToAdd);

    return {code: 201, message: 'Comentariul a fost adaugat'}
  }

  async deletePartnerComment(comment_id: number) {
    const models = initModels(sequelize);

    await models.PartnerComment.destroy({
      where: {
        partner_comment_id: comment_id
      }
    });

    return {code: 200, message: 'Comentariul a fost sters'}

  }

  async deletePartnerContact(contact_id: number) {
    const models = initModels(sequelize);

    await models.Contact.destroy({
      where: {
        contact_id: contact_id
      }
    });

    return {code: 200, message: 'Contactul a fost sters.'}
  }
}

export default new PartnerService();
