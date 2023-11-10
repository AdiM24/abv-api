import express from 'express';
import { initModels } from '../db/models/init-models';
import { sequelize } from '../db/sequelize';

const autoFleetTypes = ['Leasing', 'Casco', 'RCA', 'Diurna Sofer', 'RO vigneta', 'Hu vigneta', 'Cauciucuri', 'Autostrăzi', 'Asigurare CMR', 'Revizii', 'Alte Cheltuieli'];
const partnertypes = ['Chirie', 'Întreținere', 'Digi', 'Asibox', 'Curieri', 'CargoTrack', 'Depozite', 'Bugetul de Stat', 'Contribuții Asigurare Munca', 'TVA', 'Burse', 'Salarii Angajați', 'Bonuri', 'Consumabile', 'Alte Cheltuieli'];

class DevizMiddleware {
  async validateDevizTypeForCreate(req: express.Request, res: express.Response, next: express.NextFunction) {
    if (!req.body.auto_fleet_id && !req.body.partner_id) {
      return res.status(400).send({
        error: 'Selectati un vehicul sau o firma pentru deviz.'
      });
    }

    if (!req.body.denumire) {
      return res.status(400).send({
        error: 'Selectati denumirea pentru deviz.'
      });
    }


    if (req.body.auto_fleet_id) {
      if (!autoFleetTypes.includes(req.body.denumire)) {
        return res.status(400).send({
          error: 'Denumirea devizului selectata nu poate fi adaugata la un vehicul.'
        });
      }
    }

    if (req.body.partner_id) {
      if (!partnertypes.includes(req.body.denumire)) {
        return res.status(400).send({
          error: 'Denumirea devizului selectata nu poate fi adaugata la o firma.'
        });
      }
    }

    next();
  }

  async validateDevizTypeForUpdate(req: express.Request, res: express.Response, next: express.NextFunction) {
    const models = initModels(sequelize);

    if (req.body.denumire) {
      const existingDeviz = await models.Deviz.findOne({
        where: {
          deviz_id: req.params?.id
        }
      });
      if (existingDeviz.auto_fleet_id) {
        if (req.body.partner_id) {
          return res.status(409).send({
            error: "Nu puteti muta devizul de la un vehicul la o firma."
          })
        }
        if (!autoFleetTypes.includes(req.body.denumire)) {
          return res.status(400).send({
            error: 'Denumirea devizului selectata nu poate fi adaugata la un vehicul.'
          });
        }
      } else {
        if (req.body.auto_fleet_id) {
          return res.status(409).send({
            error: "Nu puteti muta devizul de la o firma la un vehicul."
          })
        }
        if (!partnertypes.includes(req.body.denumire)) {
          return res.status(400).send({
            error: 'Denumirea devizului selectata nu poate fi adaugata la o firma.'
          })
        }
      }
    }

    next();
  }
}

export default new DevizMiddleware();
