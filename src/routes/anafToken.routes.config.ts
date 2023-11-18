import anafTokenController from '../controllers/anafToken.controller';
import { CommonRoutesConfig } from '../common/common.routes.config';
import express from 'express';

export class AnafTokenRoutes extends CommonRoutesConfig {
    constructor(app: express.Application) {
        super(app, 'AnafTokenRoutes');
    }

    configureRoutes(): express.Application {

        this.app.route('/api/anaf/authorize/:id').get(anafTokenController.anafAuth);
        this.app.route('/api/anaf/callback').get(anafTokenController.anafCallback);

        return this.app;
    }
}
