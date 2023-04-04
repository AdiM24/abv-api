import {initModels} from "../db/models/init-models";
import {sequelize} from "../db/sequelize";

class UserPartnerMappingService {
  async getUserPartnerMappings(userId: number) {
    const models = initModels(sequelize);

    const userPartnerMappings = await models.UserPartnerMap.findAll({
      where: {
        user_id: userId
      }
    });

    return userPartnerMappings;
  }
}

export default new UserPartnerMappingService();