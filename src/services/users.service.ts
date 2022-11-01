import {sequelize} from "../db/sequelize";
import {initModels} from "../db/models/init-models";

class UsersService {
    async getAll() {
        const models = initModels(sequelize);

        const users = await models.User.findAll();

        return users;
    }
}

export default new UsersService();