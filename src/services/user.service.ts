import {sequelize} from "../db/sequelize";
import {
  AutoFleet,
  initModels,
  Partner,
  User,
  UserInvoiceSeries,
  UserInvoiceSeriesAttributes, UserPartnerMap,
  UserRoles, UserVehicle
} from "../db/models/init-models";
import {CreateUserDto} from "../dtos/create.user.dto";
import {cryptPassword, encryptPassword} from "../common/encryption";
import debug from "debug";
import {CreateUserPartnerEmail, UserDto} from "../dtos/user.dto";
import {CreateUserInvoiceSeriesDto} from "../dtos/create.user-invoice-series.dto";
import {CreateUserRoleDto} from "../dtos/create.user.role.dto";
import {UpdateUserRoleDto} from "../dtos/update.user.role.dto";
import {getLikeQuery} from "../common/utils/query-utils.service";
import {Op, where} from "sequelize";
import {CreateUserPartnerDto} from "../dtos/create.user-partner.dto";
import {CreateUserVehicleDto} from "../dtos/create.user-vehicle.dto";

const log: debug.IDebugger = debug("app:users-controller");

class UserService {
  async getAll(queryParams: any) {
    const models = initModels(sequelize);
    const queryObject = {deleted: false} as any;

    if (queryParams.email) {
      queryObject.email = getLikeQuery(queryParams.email);
    }

    const dbUsers = await models.User.findAll({
      where: {
        [Op.and]: {
          ...queryObject,
        },
      },
      include: [
        {model: UserRoles, as: 'UserRoles'},
      ]
    });

    return dbUsers.map((dbUser) => {
      return {
        id: dbUser.get().user_id,
        email: dbUser.email,
        created_at_utc: new Date(dbUser.created_at_utc),
        first_name: dbUser.first_name,
        last_name: dbUser.last_name,
        phone: dbUser.phone,
        id_card_series: dbUser.id_card_series,
        id_card_number: dbUser.id_card_number,
        id_card_issued_by: dbUser.id_card_issued_by,
        userRoles: dbUser.UserRoles
      } as UserDto;
    });
  }

  async createUser(user: CreateUserDto) {
    const models = initModels(sequelize);
    const userExisting = await this.getUserByEmail(user.email);

    if (userExisting && userExisting.deleted) {
      return await this.reactivateDeletedUser(userExisting, user);
    }

    user.password = await cryptPassword(user.password);

    try {
      const created = await models.User.create(user);
      const userRole: CreateUserRoleDto = {role: user.role, user_id: created.user_id};
      const userPartner: CreateUserPartnerDto = {user_id: created.user_id, partner_id: Number(user.partner.partner_id)};
      let userVehicle = {};

      if (user.vehicle?.auto_fleet_id) {
        userVehicle = {
          user_id: created.user_id,
          vehicle_id: Number(user.vehicle.auto_fleet_id)
        } as CreateUserVehicleDto;
      }

      await this.addUserRoles(userRole);
      await models.UserPartnerMap.create(userPartner);
      Object.keys(userVehicle).length > 0 && await models.UserVehicle.create(userVehicle);

      return "Successfully created";
    } catch (err) {
      log(err);
    }
  }

  async createUsers(users: CreateUserDto[]) {
    const models = initModels(sequelize);

    try {
      users.map(async (user) => {
        user.password = await cryptPassword(user.password);
      });

      await models.User.bulkCreate(users);

      return "Successfully created";
    } catch (err) {
      return err;
    }
  }

  async getUser(user_id: number) {
    const models = initModels(sequelize);

    return await models.User.findOne({
      attributes: ["user_id", 'email', 'first_name', 'last_name', 'phone',
        'id_card_series', 'id_card_number', 'id_card_issued_by', 'token_anaf'],
      where: {
        user_id: user_id
      },
      include: [
        {model: UserRoles, as: 'UserRoles'},
        {model: UserVehicle, as: 'UserVehicles', include: [{model: AutoFleet, as: 'vehicle'}]},
      ]
    });
  }

  async getUserByEmail(email: string) {
    const models = initModels(sequelize);

    return models.User.findOne({
      where: {
        email: email,
      },
      include: [
        {model: UserRoles, as: 'UserRoles'}
      ],
    });
  }

  async removeDefaultSeriesAttribute(userInvoiceSeries: UserInvoiceSeriesAttributes) {
    const models = initModels(sequelize);

    const existingDefault = await models.UserInvoiceSeries.findOne({
      where: {
        user_id: userInvoiceSeries.user_id,
        invoice_type: userInvoiceSeries.invoice_type,
        default: true
      }
    });

    if (!existingDefault) {
      return;
    }

    existingDefault.default = false;

    try {
      await existingDefault.save();
      return;
    } catch (err) {
      console.error(err);
    }
  }

  async changeDefaultSeries(userInvoiceSeries: UserInvoiceSeries) {
    const models = initModels(sequelize);

    await this.removeDefaultSeriesAttribute(userInvoiceSeries);

    const newDefault = await models.UserInvoiceSeries.findOne({
      where: {
        user_id: userInvoiceSeries.user_id,
        invoice_type: userInvoiceSeries.invoice_type,
        series: userInvoiceSeries.series
      }
    });

    newDefault.default = true;

    try {
      await newDefault.save();
      return newDefault;
    } catch (err) {
      console.error(err);
    }
  }

  async createUserSeries(userInvoiceSeries: CreateUserInvoiceSeriesDto, decodedToken: any = undefined) {
    const models = initModels(sequelize);

    const series: any = userInvoiceSeries;
    series.user_id = decodedToken?._id;

    if (series.default) {
      await this.removeDefaultSeriesAttribute(series);
    }

    try {
      const created = await models.UserInvoiceSeries.create(series);

      return created;
    } catch (err) {
      console.error(err);
    }
  }

  async getUserSeries(user_id: number, invoice_type: string, is_default: boolean = undefined) {
    const models = initModels(sequelize);

    if (is_default) {
      const userSerie = await models.UserInvoiceSeries.findOne({
        where: {
          user_id: user_id,
          invoice_type: invoice_type,
          default: true
        }
      });

      return userSerie;
    }

    const userSeries = await models.UserInvoiceSeries.findAll({
      where: {
        user_id: user_id
      }
    });

    return userSeries;
  }

  async addUserRoles(userRole: CreateUserRoleDto) {
    const models = initModels(sequelize);

    return await models.UserRoles.create(userRole);
  }

  async changeUserPassword({email, newPassword}: any) {
    const models = initModels(sequelize);

    const user = await models.User.findOne({
      where: {
        email: email
      }
    });

    user.password = await cryptPassword(newPassword);

    await user.save();
  }

  async changeUserRole(userRole: UpdateUserRoleDto) {
    const models = initModels(sequelize);

    const userRoleExisting = await models.UserRoles.findOne({
      where: {
        user_role_id: userRole.user_role_id
      }
    });

    userRoleExisting.role = userRole.role;

    await userRoleExisting.save();
  }

  async createUserPartnerEmail(userPartnerEmail: CreateUserPartnerEmail) {
    const models = initModels(sequelize);

    userPartnerEmail.password = await encryptPassword(userPartnerEmail.password);

    try {
      await models.UserPartnerEmail.create(userPartnerEmail);

      return {code: 201, message: 'Adresa de email a fost creata.'};
    } catch (err) {
      console.error(err);
    }
  }

  async getUserPartnerEmails(decodedToken: any) {
    const models = initModels(sequelize);

    const userPartnerEmails = await models.UserPartnerEmail.findAll({
      where: {
        user_id: decodedToken._id
      },
      include: [
        {model: Partner, as: 'partner'}
      ]
    });

    return userPartnerEmails.map((userPartnerEmail) => ({
      user_id: userPartnerEmail.user_id,
      partner_id: userPartnerEmail.partner_id,
      smtp: userPartnerEmail.smtp,
      partner_email: userPartnerEmail.partner_email,
      partner_name: userPartnerEmail.partner.name
    }));
  }

  async getUserPartnerEmail(userPartnerEmailId: number) {
    const models = initModels(sequelize);

    const userPartnerEmail = await models.UserPartnerEmail.findOne({
      where: {
        user_partner_email_id: userPartnerEmailId
      },
      include: []
    });

    return {
      user_partner_email_id: userPartnerEmail.user_partner_email_id,
      partner_id: userPartnerEmail.partner_id,
      user_id: userPartnerEmail.user_id,
      partner_email: userPartnerEmail.partner_email
    };
  }

  async updateUserPartnerEmail(userPartnerToUpdate: any) {
    const models = initModels(sequelize);

    const existingUserPartner = await models.UserPartnerEmail.findOne({
      where: {
        user_partner_email_id: userPartnerToUpdate.user_partner_email_id
      }
    });

    existingUserPartner.partner_email = userPartnerToUpdate.partner_email;
    existingUserPartner.smtp = userPartnerToUpdate.smtp;

    try {
      await existingUserPartner.save();

      return {code: 200, message: 'Datele utilizatorului au fost actualizate'}
    } catch (error) {
      console.error(error);
    }
  }

  async removeUserPartnerEmail(userPartnerEmailId: number) {
    const models = initModels(sequelize);

    const existingUserPartner = await models.UserPartnerEmail.findOne(({
      where: {
        user_partner_email_id: userPartnerEmailId
      }
    }));

    try {
      await existingUserPartner.destroy();

      return {code: 200, message: 'Datele utilizatorului au fost sterse'}
    } catch (err) {
      console.error(err);
    }
  }

  async deleteUserSeries(series_id: number) {
    const models = initModels(sequelize);

    await models.UserInvoiceSeries.destroy({
      where: {
        user_invoice_series_id: series_id
      }
    });

    return {code: 200, message: 'Seria a fost stearsa'};
  }

  async getUserVehicle(token: any) {
    const models = initModels(sequelize);
    const userId = token._id;

    const userVehicle = await models.UserVehicle.findOne({
      attributes: ['vehicle_id'],
      where: {
        user_id: Number(userId)
      },
      raw: true
    });

    const vehicle = await models.AutoFleet.findOne({
      where: {
        auto_fleet_id: Number(userVehicle.vehicle_id)
      }
    });

    return vehicle;
  }

  async updateUser(user: User) {
    const models = initModels(sequelize);
    const existingUser = await this.getUser(user.user_id);
    const userByEmail = await this.getUserByEmail(user.email);

    if (userByEmail && userByEmail.user_id != user.user_id) {
      return {code: 400, message: 'Mai exista deja alt utilizator cu aceeasi adresa de e-mail'};
    }

    existingUser.email = user.email;
    existingUser.first_name = user.first_name;
    existingUser.last_name = user.last_name;
    existingUser.phone = user.phone;
    existingUser.id_card_series = user.id_card_series;
    existingUser.id_card_number = user.id_card_number;
    existingUser.id_card_issued_by = user.id_card_issued_by;
    existingUser.deleted = false;

    try {
      await models.UserVehicle.update(
        {vehicle_id: Number(user.vehicle.auto_fleet_id)},
        {
          where: {
            user_id: Number(user.user_id)
          }
        }
      )

      await existingUser.update(existingUser);
      await existingUser.save();
    } catch (error) {
      console.error(error);
      return {code: 500, message: error.message};
    }
    return {code: 200, message: 'Utilizatorul a fost actualizat'};

  }

  async deleteUser(id: number) {
    const existingUser = await this.getUser(id);
    existingUser.deleted = true;

    try {
      await existingUser.update(existingUser);
      await existingUser.save();
    } catch (error) {
      console.error(error);
      return {code: 500, message: error.message};
    }
    return {code: 200, message: 'Utilizatorul a fost marcat sters.'};

  }

  private async reactivateDeletedUser(userExisting: User, user: CreateUserDto) {
    userExisting.email = user.email;
    userExisting.first_name = user.first_name;
    userExisting.last_name = user.last_name;
    userExisting.phone = user.phone;
    userExisting.id_card_series = user.id_card_series;
    userExisting.id_card_number = user.id_card_number;
    userExisting.id_card_issued_by = user.id_card_issued_by;
    await this.updateUser(userExisting);
    await this.changeUserPassword({email: user.email, newPassword: user.password});
    if (userExisting.UserRoles && userExisting.UserRoles.length == 1) {
      await this.changeUserRole({user_role_id: userExisting.UserRoles[0].user_role_id, role: user.role});
    }
    return "Successfully created";
  }
}

export default new UserService();
