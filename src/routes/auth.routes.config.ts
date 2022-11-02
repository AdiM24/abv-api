import {CommonRoutesConfig} from "../common/common.routes.config";
import express from "express";
import UsersMiddleware from "../middleware/user.middleware";
import AuthController from "../controllers/auth.controller";

export class AuthRoutes extends CommonRoutesConfig {
    constructor(app: express.Application) {
        super(app, 'UserRoutes');
    };

    configureRoutes(): express.Application {
        this.app.route('/login')
            .post(
                UsersMiddleware.validateRequiredUserBodyFields,
                AuthController.login
            );

        return this.app;
    }
}