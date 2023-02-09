import {sequelize} from "../db/sequelize";
import {initModels, Product} from "../db/models/init-models";
import {Op} from "sequelize";
import {getDateRangeQuery, getLikeQuery,} from "../common/utils/query-utils.service";
import {CreateProductDto} from "../dtos/create.product.dto";
import {UpdateProductDto} from "../dtos/update.product.dto";

class ProductService {
  async addProduct(productToAdd: CreateProductDto) {
    const models = initModels(sequelize);
    try {
      const [product, created] = await models.Product.findOrCreate({
        where: {
          product_name: productToAdd.product_name
        },
        defaults: {...productToAdd, created_at_utc: new Date().toUTCString(), modified_at_utc: new Date().toUTCString()}
      });

      if (!created) {
        product.quantity += Number(productToAdd.quantity);

        await product.save();

        return product;
      }

      return product;
    } catch (err) {
      console.error(err);
    }
  }

  async getProducts() {
    const models = initModels(sequelize);

    const products = await models.Product.findAll();

    products.forEach((product: Product) => {
      product.get().created_at_utc.toLocaleString();
    });

    return products;
  }

  async getProductAutocompleteOptions(searchKey: string) {
    const models = initModels(sequelize);

    let products: Product[];

    try {
      products = await models.Product.findAll({
        where: {
          product_name: getLikeQuery(searchKey)
        }
      })
    } catch (err) {
      console.error(err);
    }

    return products.map((product: Product) => (
      {
        product_id: product.product_id,
        product_name: product.product_name
      }
    ))
  }

  async getProduct(id: number) {
    const models = initModels(sequelize);

    const product = (
      await models.Product.findOne({
        where: {
          product_id: id,
        },
      })
    )?.get();

    if (!product) {
      return `No product found for id ${id}`;
    }

    return product;
  }

  async getProductByName(name: string) {
    const models = initModels(sequelize);

    const product = (
      await models.Product.findOne({
        where: {
          product_name: name
        }
      })
    )?.get();

    if (!product) {
      return `No product found for name ${name}`;
    }

    return product
  }

  async getFilteredProducts(queryParams: any) {
    const models = initModels(sequelize);

    const queryObject = {} as any;

    if (queryParams.created_at_from || queryParams.created_at_to)
      queryObject.created_at_utc = getDateRangeQuery(
        queryParams.created_at_from,
        queryParams.created_at_to
      );

    if (queryParams.product_name)
      queryObject.product_name = getLikeQuery(queryParams.product_name);

    return await models.Product.findAll({
      where: {
        [Op.and]: {
          ...queryObject,
        },
      },
    });
  }

  async updateProduct(product: UpdateProductDto) {
    const models = initModels(sequelize);

    product.modified_at_utc = new Date(product.modified_at_utc).toUTCString();

    try {
      return await models.Product.update(product, {
        where: {
          product_id: product.product_id,
        },
      });
    } catch (err) {
      console.error(err);
    }
  }

  async checkProductQuantity(product: { product_name: string, quantity: number }) {
    const models = initModels(sequelize);

    try {
      return (await models.Product.findOne({
        where: {
          product_name: product.product_name
        }
      })).quantity >= product.quantity
    } catch (err) {
      console.error(err);
    }
  }

  async reserveProductQuantity(product: { product_name: string, quantity: number }) {
    const models = initModels(sequelize);

    try {
      const existingProduct: Product = await models.Product.findOne({
        where: {
          product_name: product.product_name
        }
      });

      if (existingProduct.quantity < product.quantity) {
        return false;
      }

      existingProduct.quantity -= product.quantity;
      await existingProduct.save();
      return {product_id: existingProduct.product_id};
    } catch (err) {
      console.error(err);
    }
  }

  async addProductQuantity(product: { product_name: string, quantity: number }) {
    const models = initModels(sequelize);

    try {
      const existingProduct: Product = await models.Product.findOne({
        where: {
          product_name: getLikeQuery(product.product_name)
        }
      });

      if (!existingProduct) {
        return false;
      }
      existingProduct.quantity += product.quantity;
      await existingProduct.save();
      return true;
    } catch (err) {
      console.error(err);
    }

  }
}

export default new ProductService();
