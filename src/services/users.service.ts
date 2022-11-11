import { sequelize } from "../db/sequelize";
import { initModels } from "../db/models/init-models";
import { CreateUserDto } from "../dtos/create.user.dto";
import { cryptPassword } from "../common/encryption";
import debug from "debug";
import { UserDto } from "../dtos/user.dto";

const log: debug.IDebugger = debug("app:users-controller");

class UsersService {
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
      await models.User.create(user);

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
}

export default new UsersService();
