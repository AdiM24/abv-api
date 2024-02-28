import {sequelize} from "../db/sequelize";
import {initModels,} from "../db/models/init-models";
import {getLikeQuery, getStrictQuery} from "../common/utils/query-utils.service";

class LocalitiesService {

    async getCounties(searchKey: string) {
        const models = initModels(sequelize);

        let counties: string[];

        try {
            let where = {};
            if (searchKey) {
                where = {
                    county: getLikeQuery(searchKey)
                };
            }
            let localities = await models.Localitate.findAll({
                where,
                attributes: [[sequelize.fn('DISTINCT', sequelize.col('county')), 'county']],
                order: ["county"]

            })
            counties = localities.map(item => item.county);
        } catch (err) {
            console.error(err);
        }

        return counties;
    }

    async getCities(county: string, searchQuery: string) {
        const models = initModels(sequelize);

        let cities: string[];
        let where:any = {};
        if (county) {
            where.county = getStrictQuery(county);
        }
        if (searchQuery) {
            where.cit = getLikeQuery(county);
        }
        try {
            let localities = await models.Localitate.findAll({
                where
            });
            cities = localities.map(item => item.city)
        } catch (err) {
            console.error(err);
        }

        return cities;
    }
}


export default new LocalitiesService();
