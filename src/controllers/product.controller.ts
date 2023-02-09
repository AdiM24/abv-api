import express from "express";
import ProductService from "../services/product.service";
import {ResponseError} from "../common/models/common.types";

class ProductController {
  async addProduct(req: express.Request, res: express.Response) {
    const addedProduct = await ProductService.addProduct(req.body);

    res.status(201).send(addedProduct);
  }

  async getAutocompleteOptions(req: express.Request, res: express.Response) {
    res.status(200).send(await ProductService.getProductAutocompleteOptions(req.query?.searchKey.toString()))
  }

  async getProducts(req: express.Request, res: express.Response) {
    const products = Object.keys(req.query).length
      ? await ProductService.getFilteredProducts(req.query)
      : await ProductService.getProducts();

    res.status(200).send(products);
  }

  async getProduct(req: express.Request, res: express.Response) {
    const productId = Number(req.params.id);

    if (!productId) {
      res.send({
        errorCode: 400,
        message: "Partner could not be found",
      } as ResponseError);
    }

    const product = await ProductService.getProduct(productId);

    return res.status(200).send(product);
  }

  async getProductByName(req: express.Request, res: express.Response) {
    const name = req.params.product_name;

    const product = await ProductService.getProductByName(name);

    return res.status(200).send(product);
  }

  async updateProduct(req: express.Request, res: express.Response) {
    const result = await ProductService.updateProduct(req.body);

    console.log(result);

    return res.status(200).send(result);
  }

  async reserveProductQuantity(req: express.Request, res: express.Response) {
    const result = await ProductService.reserveProductQuantity(req.body);

    return result ? res.status(200).send(result) : res.status(400).send(result);
  }

  async checkProductQuantity(req: express.Request, res: express.Response) {
    const result = await ProductService.checkProductQuantity(req.body);

    return result ? res.status(200).send(result) : res.status(400).send(result);
  }

  async addProductQuantity(req: express.Request, res: express.Response) {
    const result = await ProductService.addProductQuantity(req.body);

    return result ? res.status(200).send(result) : res.status(400).send(result);
  }
}

export default new ProductController();
