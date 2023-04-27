import {CommonRoutesConfig} from "../common/common.routes.config";
import express from "express";
import multer from "multer";
import ImageController from "../controllers/image.controller";
import ImageMiddleware from "../middleware/image.middleware";
import AuthMiddleware from "../middleware/auth.middleware";

export class ImageRoutes extends CommonRoutesConfig {
  constructor(app: express.Application) {
    super(app, "ImageRoutes");
  }

  configureRoutes(): express.Application {
    console.log();
    this.app.route('/api/images')
      .get(AuthMiddleware.auth, ImageController.getImage)
      .post(AuthMiddleware.auth, multer({dest: 'images'}).single('image'),  ImageMiddleware.validateOneLogo, ImageController.uploadImage)

    return this.app
  }

}