import express, {NextFunction} from "express";
import ProductService from "../services/product.service";

class ProductMiddleware {
  async validateProductExists(req: express.Request, res: express.Response, next: NextFunction) {
    const productExists = !!(await ProductService.getProduct(req.body.product_id));

    if (!productExists) {
      res.status(404).send({error: 404, message: "Product does not exist"});
    }

    next();
  }
}

export default new ProductMiddleware();