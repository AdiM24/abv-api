import {sequelize} from "../db/sequelize";
import {initModels} from "../db/models/init-models";
import {CreateUserDto} from "../dtos/create.user.dto";
import {cryptPassword} from "../common/encryption";
import debug from "debug";
import {UserDto} from "../dtos/user.dto";

const log: debug.IDebugger = debug('app:users-controller');

class UsersService {
    async getAll() {
        const models = initModels(sequelize);


        const dbUsers = await models.User.findAll();

        return dbUsers.map((dbUser) => {
            return {
                email: dbUser.email,
                created_at_utc: new Date(dbUser.created_at_utc),
                first_name: dbUser.first_name,
                last_name: dbUser.last_name,
                phone: dbUser.phone
            } as UserDto
        })
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
    };

    async getUserByEmail(email: string) {
        const models = initModels(sequelize);

        return models.User.findOne({
            where: {
                email
            }
        })
    }
}

export default new UsersService();