import express from "express";
import {JwtPayload} from "jsonwebtoken";
import * as jwt from "jsonwebtoken";

interface CustomRequest extends express.Request {
    token: string | JwtPayload;
}

class AuthMiddleware {
    auth = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        try {
            const token = req.header('Authorization').replace('Bearer ', '');

            if (!token) {
                throw new Error('Invalid token');
            }

            const decoded = jwt.verify(token, process.env["SECRET_KEY"]);
            (req as CustomRequest).token = decoded;

            next();
        } catch(err) {
            res.status(401).send('Please authenticate');
        }
    }
}

export default new AuthMiddleware();