import { sequelize } from "../../db/sequelize";
import {  initModels } from "../../db/models/init-models";
import { QueryTypes} from "sequelize";
import ExportPdf from "./export-pdf";


class AutoProfitLossService {

  async getReport(queryParams: any) {

    const models = initModels(sequelize);

    try {

      let select = "select car, currency, ";
        let groupBy = "group by x.car, x.currency";

        if(queryParams.groupByDate == 'true'){
          select += "date, ";
          groupBy += ", date";
        }

      if(queryParams.groupByDescription == 'true'){
          select += "description, ";
          groupBy += ", description";
      }
      select += "sum(x.profit) as profit, sum(x.loss) as loss";

      let where = "where car is not null";

        if (queryParams.id) {
            const filter = queryParams.id.split(':');
            if (filter[0] === 'auto_fleet_id') {
               where += ' AND car = (select reg_no from "AutoFleet" where auto_fleet_id = '+ filter[1]+')';
            }
        }

        if (queryParams.date_from) {
            where += ' AND date >= \''+new Date(queryParams.date_from).toISOString()+'\'';
        }
        if (queryParams.date_to) {
            where += ' AND date < \''+new Date(queryParams.date_to).toISOString()+'\'';
        }

      const result = await sequelize.query(select + "\n" +
          "from (Select reg_no                           as car,\n" +
          "             currency                         as currency,\n" +
          "             date,\n" +
          "             infos                            as description,\n" +
          "             sum(pret_fara_tva + \"Deviz\".tva) as loss,\n" +
          "             sum(0)                           as profit\n" +
          "      from \"Deviz\"\n" +
          "               inner join \"AutoFleet\" on \"Deviz\".auto_fleet_id = \"AutoFleet\".auto_fleet_id\n" +
          "      group by reg_no, date, currency, description\n" +
          "      union all\n" +
          "      select car_reg_number                   as car,\n" +
          "             CAST(profit_currency as varchar) as currency,\n" +
          "             created_at_utc                   as date,\n" +
          "             package_info                     as description,\n" +
          "             sum(0)                           as loss,\n" +
          "             sum(profit)                      as profit\n" +
          "      from \"Order\"\n" +
          "      group by car_reg_number, profit_currency, date, description) x\n" +
          where + "\n" + groupBy + ' order by date desc'
          , { type: QueryTypes.SELECT });

        const resultTotals = await sequelize.query("select currency, sum(x.profit) as profit, sum(x.loss) as loss\n" +
            "from (Select reg_no                           as car,\n" +
            "             currency                         as currency,\n" +
            "             date,\n" +
            "             infos                            as description,\n" +
            "             sum(pret_fara_tva + \"Deviz\".tva) as loss,\n" +
            "             sum(0)                           as profit\n" +
            "      from \"Deviz\"\n" +
            "               inner join \"AutoFleet\" on \"Deviz\".auto_fleet_id = \"AutoFleet\".auto_fleet_id\n" +
            "      group by reg_no, date, currency, description\n" +
            "      union all\n" +
            "      select car_reg_number                   as car,\n" +
            "             CAST(profit_currency as varchar) as currency,\n" +
            "             created_at_utc                   as date,\n" +
            "             package_info                     as description,\n" +
            "             sum(0)                           as loss,\n" +
            "             sum(profit)                      as profit\n" +
            "      from \"Order\"\n" +
            "      group by car_reg_number, profit_currency, date, description) x\n" +
            where + "\n group by currency"
            , { type: QueryTypes.SELECT });
        return {
            code: 200, message: {
                rows: result,
                totals: resultTotals
            }
        };
    } catch (error) {
      return { code: 500, message: `${error}` };
    }
  }

    async getReportPdf(queryParams: any) {
      let result = await this.getReport(queryParams);
      return await ExportPdf(result, queryParams);
    }

    }

export default new AutoProfitLossService();
