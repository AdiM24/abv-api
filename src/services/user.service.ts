import {sequelize} from "../db/sequelize";
import {initModels, UserInvoiceSeries, UserInvoiceSeriesAttributes} from "../db/models/init-models";
import {CreateUserDto} from "../dtos/create.user.dto";
import {cryptPassword} from "../common/encryption";
import debug from "debug";
import {UserDto} from "../dtos/user.dto";
import {CreateUserInvoiceSeriesDto} from "../dtos/create.user-invoice-series.dto";

const log: debug.IDebugger = debug("app:users-controller");

class UserService {
  async getAll() {
    const models = initModels(sequelize);

    const dbUsers = await models.User.findAll();

    return dbUsers.map((dbUser) => {
      return {
        id: dbUser.get().user_id,
        email: dbUser.email,
        created_at_utc: new Date(dbUser.created_at_utc),
        first_name: dbUser.first_name,
        last_name: dbUser.last_name,
        phone: dbUser.phone,
      } as UserDto;
    });
  }

  async createUser(user: CreateUserDto) {
    const models = initModels(sequelize);

    user.password = await cryptPassword(user.password);

    try {
      const created = await models.User.create(user);
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

  async getUserByEmail(email: string) {
    const models = initModels(sequelize);

    return models.User.findOne({
      where: {
        email: email,
      },
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
    } catch(err) {
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
    } catch(err) {
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
}

export default new UserService();
