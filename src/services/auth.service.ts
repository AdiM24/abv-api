import {initModels} from "../db/models/init-models";
import {sequelize} from "../db/sequelize";
import {comparePassword} from "../common/encryption";
import * as jwt from "jsonwebtoken";
import debug from "debug";
import {LoginDto} from "../dtos/login.dto";

const log: debug.IDebugger = debug('app:users-controller');

class AuthService {
    async login(userLoginInfo: LoginDto) {
        const SECRET_KEY = process.env["SECRET_KEY"];

        log(SECRET_KEY);

        const models = initModels(sequelize);


        const user = await models.User.findOne({
            where: {
                email: userLoginInfo.email,
            }
        })

        if (!user) {
            return 'Incorect username or password';
        }

        const isMatch = await comparePassword(userLoginInfo.password, user.password);

        if (!isMatch) {
            return 'Incorrect username or password';
        }

        const token = jwt.sign({_id: user.user_id?.toString(), email: user.email}, SECRET_KEY, {
            expiresIn: '2 days'
        });

        return {user: user.email, token};
    }
}

export default new AuthService();