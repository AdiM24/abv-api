import express from "express";
import UserService from "../services/user.service";
import {CustomRequest} from "./auth.middleware";

class UsersMiddleware {

    validateSameEmailDoesntExist = async (
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) => {
        const user = await UserService.getUserByEmail(req.body.email);

        if (user && !user.deleted) {
            res.status(400).send({error: `Exista deja un utilizator cu adresa de e-mail introdusa.`});
        } else {
            next();
        }
    }

    validateRequiredUserBodyFields = async (
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) => {
        if (req.body && req.body.email && req.body.password) {
            next();
        } else {
            res.status(400).send({
                error: `Missing required fields email and password`,
            });
        }
    }

    validateClaimingUser = async (
      req: CustomRequest,
      res: express.Response,
      next: express.NextFunction
    ) => {
        const requestingUser = req.body.user_id || req.query?.user_id;

        if (!requestingUser) {
            return res.status(400).send({error: 400, message: 'Utilizator invalid'});
        }

        const actualUser = (req.token as any)._id;

        if (Number(requestingUser) !== Number(actualUser)) {
            return res.status(400).send({error:400, message: 'Utilizator invalid'});
        }

        next();
    }

    validateUserPartnerEmail = async (
      req: CustomRequest,
      res: express.Response,
      next: express.NextFunction
    ) => {
        const actualUser = (req.token as any)._id;

        const userPartnerEmailId = req.body?.user_partner_email_id || req.query.user_partner_email;

        if (userPartnerEmailId) {
            return res.status(400).send({code: 400, message: 'Adresa de email este invalida'});
        }

        const userEmailAddress = await UserService.getUserPartnerEmail(userPartnerEmailId);

        if (!userEmailAddress) {
            return res.status(400).send({code: 400, message:'Adresa de email nu a putut fi gasita'});
        }

        if (Number(userEmailAddress.user_id) !== Number(actualUser)) {
            return res.status(400).send({code: 400, message: 'Adresa de email nu apartine acestui utilizator'})
        }

        next();
    }
}

export default new UsersMiddleware();
