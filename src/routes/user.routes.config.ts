import {CommonRoutesConfig} from "../common/common.routes.config";
import express from "express";
import UsersController from "../controllers/user.controller"

export class UserRoutes extends CommonRoutesConfig {
    constructor(app: express.Application) {
        super(app, 'UserRoutes');
    };

    configureRoutes(): express.Application {
        this.app.route('/users').get(UsersController.getUsers);

        return this.app;
    }
}