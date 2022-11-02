import express from "express";
import UsersService from "../services/users.service";

class UsersMiddleware {

    validateSameEmailDoesntExist = async (
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) => {
        const user = await UsersService.getUserByEmail(req.body.email);
        if (user) {
            res.status(400).send({error: `User email already exists`});
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
}

export default new UsersMiddleware();