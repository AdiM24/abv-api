import type {Sequelize} from "sequelize";
import type {UserAttributes, UserCreationAttributes} from "./User";
import {User as _User} from "./User";

export {
    _User as User,
};

export type {
    UserAttributes,
    UserCreationAttributes,
};

export function initModels(sequelize: Sequelize) {
    const User = _User.initModel(sequelize);


    return {
        User: User,
    };
}
