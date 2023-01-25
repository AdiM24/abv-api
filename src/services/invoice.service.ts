import {sequelize} from "../db/sequelize";
import {initModels, Invoice, Product} from "../db/models/init-models";
import {Op} from "sequelize";
import {CreateInvoiceDto} from "../dtos/create.invoice.dto";
import {CreateInvoiceProductDto} from "../dtos/create.invoice-product.dto";

class InvoiceService {
  async createInvoice(invoiceToAdd: CreateInvoiceDto, models: any) {
    let createdInvoice: Invoice;

    try {
      createdInvoice = await models.Invoice.create(invoiceToAdd);
    } catch (err) {
      console.error(err);
    }

    return createdInvoice
  }

  async addReceivedInvoice(invoiceToAdd: CreateInvoiceDto) {
    const models = initModels(sequelize);

    invoiceToAdd.type = 'received';

    const invoiceDate = new Date(invoiceToAdd.created_at_utc).setHours(0, 0, 0, 0)

    const existingInvoice = await models.Invoice.findOne({
      where: {
        created_at_utc: invoiceDate,
        series: invoiceToAdd.series,
        number: invoiceToAdd.number
      }
    });

    if (existingInvoice) {
      return {error: 400, message: "Invoice already exists"}
    }

    const createdInvoice = await this.createInvoice(invoiceToAdd, models);

    let invoiceDbProducts: { rows: Product[], count: number };

    try {
      invoiceDbProducts = await models.Product.findAndCountAll({
        where: {
          product_id: {
            [Op.in]: invoiceToAdd.products.map((invoiceProduct: CreateInvoiceProductDto) => invoiceProduct.product_id)
          }
        }
      });
    } catch (err) {
      console.error(err);
    }


    const invoiceProducts: CreateInvoiceProductDto[] = invoiceToAdd.products.map((invoiceProduct: CreateInvoiceProductDto) => {
      // const product = invoiceDbProducts.rows.find((product: Product) => product.product_id === invoiceProduct.product_id);
      //
      // if (product.get().quantity < invoiceProduct.quantity) {
      //   throw new Error(`Insufficient quantity for product ${product.product_name}, current quantity is ${product.quantity}`);
      // }
      //
      // product.get().quantity -= invoiceProduct.quantity;

      return {
        invoice_id: createdInvoice.get().invoice_id,
        product_id: invoiceProduct.product_id,
        quantity: invoiceProduct.quantity,
        selling_price: invoiceProduct.selling_price,
        sold_at_utc: new Date().toUTCString()
      }
    });

    if (invoiceDbProducts.count !== invoiceProducts.length) {
      throw new Error('Please check all products and then try again');
    }

    try {
      invoiceProducts.map((invoiceProduct: CreateInvoiceProductDto) => {
        models.InvoiceProduct.create(invoiceProduct);
      })
    } catch (err) {
      console.error(err);
    }

  }

  //
  // async addInvoice(invoiceToAdd: CreateInvoiceDto) {
  //   const models = initModels(sequelize);
  //
  //   try {
  //     const createdInvoice = await models.Invoice.create(invoiceToAdd);
  //
  //     const products = await models.Product.findAll({
  //       where: {
  //         product_id: {
  //           [Op.in]: invoiceToAdd.products.map((product: UpdateProductDto) => product.product_id)
  //         }
  //       }
  //     });
  //
  //     // switch (invoiceToAdd.type) {
  //     //   case "fiscal":
  //     //     products.forEach((product: Product, index: number) => {
  //     //        models.InvoiceProducts.create({
  //     //         invoice_id: createdInvoice.invoice_id,
  //     //         product_id: product.get().product_id,
  //     //         quantity: invoiceToAdd.products[index].quantity
  //     //       })
  //     //
  //     //       product.get().quantity -= invoiceToAdd.products[index].quantity;
  //     //     });
  //     //     break;
  //     //
  //     //   case "issued":
  //     //     break;
  //     //
  //     //   case "proforma":
  //     //     break;
  //     //
  //     //   default:
  //     //     break;
  //     // }
  //
  //   } catch (err) {
  //     console.error(err);
  //   }
  // }
  //
  // async getProducts() {
  //   const models = initModels(sequelize);
  //
  //   const invoices = await models.Invoice.findAll();
  //
  //   invoices.forEach((invoice: Invoice) => {
  //     invoice.get().created_at_utc.toLocaleString();
  //     invoice.get().deadline_at_utc.toLocaleString();
  //   });
  //
  //   return invoices;
  // }
  //
  // async getProduct(id: number) {
  //   const models = initModels(sequelize);
  //
  //   const product = (
  //     await models.Product.findOne({
  //       where: {
  //         product_id: id,
  //       },
  //     })
  //   )?.get();
  //
  //   if (!product) {
  //     return `No product found for id ${id}`;
  //   }
  //
  //   return product;
  // }
  //
  // async getFilteredProducts(queryParams: any) {
  //   const models = initModels(sequelize);
  //
  //   const queryObject = {} as any;
  //
  //   if (queryParams.created_at_from || queryParams.created_at_to)
  //     queryObject.created_at_utc = getDateRangeQuery(
  //       queryParams.created_at_from,
  //       queryParams.created_at_to
  //     );
  //
  //   if (queryParams.product_name)
  //     queryObject.product_name = getLikeQuery(queryParams.product_name);
  //
  //   const products = await models.Product.findAll({
  //     where: {
  //       [Op.and]: {
  //         ...queryObject,
  //       },
  //     },
  //   });
  //
  //   return products;
  // }
  //
  // async updateProduct(product: UpdateProductDto) {
  //   const models = initModels(sequelize);
  //
  //   product.modified_at_utc = convertToUtc(new Date(product.modified_at_utc));
  //
  //   try {
  //     return await models.Product.update(product, {
  //       where: {
  //         product_id: product.product_id,
  //       },
  //     });
  //   } catch (err) {
  //     console.error(err);
  //   }
  // }
}

export default new InvoiceService();
