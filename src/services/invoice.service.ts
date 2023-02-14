import {sequelize} from "../db/sequelize";
import {
  BankAccount,
  initModels,
  Invoice,
  InvoiceAttributes,
  InvoiceProduct,
  Partner,
  Product,
  ProductAttributes
} from "../db/models/init-models";
import {CreateInvoiceDto} from "../dtos/create.invoice.dto";
import {CreateInvoiceProductDto, InvoiceProductInformation} from "../dtos/create.invoice-product.dto";
import {Op, WhereOptions} from "sequelize";
import {getStrictQuery} from "../common/utils/query-utils.service";

class InvoiceService {
  async getInvoices() {
    const models = initModels(sequelize);

    return await models.Invoice.findAll({
      include: [{model: Partner, as: 'client'}]
    });
  }

  async getFilteredInvoices(queryParams: any) {
    const models = initModels(sequelize);

    const queryObject = {} as any;

    if (queryParams.type) {
      queryObject.type = getStrictQuery(queryParams.type);
    }

    return await models.Invoice.findAll({
      where: {
        [Op.and]: {
          ...queryObject,
        },
      },
      include: [{model: Partner, as: 'client'}]
    });
  }

  async createInvoice(invoiceToAdd: CreateInvoiceDto, models: any) {
    let createdInvoice: Invoice;

    try {
      createdInvoice = await models.Invoice.create(invoiceToAdd);
    } catch (err) {
      console.error(err);
    }

    return createdInvoice
  }

  async addInvoice(invoiceToAdd: CreateInvoiceDto) {
    const models = initModels(sequelize);

    if (invoiceToAdd.type === 'issued') {
      invoiceToAdd.number = await this.findIssuedInvoiceNextSeriesNumber(invoiceToAdd.series);
    }

    const createdInvoice = await this.createInvoice(invoiceToAdd, models);

    const invoiceProducts: CreateInvoiceProductDto[] = invoiceToAdd.products.map((invoiceProduct: CreateInvoiceProductDto) => {
      return {
        invoice_id: createdInvoice.get().invoice_id,
        product_id: invoiceProduct.product_id,
        quantity: invoiceProduct.quantity,
        selling_price: invoiceProduct.selling_price,
        sold_at_utc: new Date().toUTCString()
      }
    });

    try {
      invoiceProducts.map((invoiceProduct: CreateInvoiceProductDto) => {
        models.InvoiceProduct.create(invoiceProduct);
      })
    } catch (err) {
      console.error(err);
    }

    createdInvoice.total_vat = 0;
    createdInvoice.total_price = 0;
    createdInvoice.total_price_incl_vat = 0;

    invoiceProducts.map((invoiceProduct: CreateInvoiceProductDto) => {
      createdInvoice.total_vat += parseFloat((((invoiceProduct.selling_price * 19) / 100) * invoiceProduct.quantity).toFixed(2));
      createdInvoice.total_price += parseFloat((invoiceProduct.selling_price * invoiceProduct.quantity).toFixed(2));
    });

    createdInvoice.total_price_incl_vat = createdInvoice.total_vat + createdInvoice.total_price;

    try {
      await createdInvoice.save();
    } catch (err) {
      console.error(err);
    }

  }

  async findInvoice(condition: WhereOptions<InvoiceAttributes>) {
    const models = initModels(sequelize);

    return await models.Invoice.findOne({
      where: condition
    });
  }

  async findIssuedInvoiceNextSeriesNumber(series: string) {
    const models = initModels(sequelize);

    const latestInvoiceNumberForSeries = (await models.Invoice.findOne({
      where: {
        series: series
      },
      order: [["number", "DESC"]]
    }))?.get('number');

    if (!latestInvoiceNumberForSeries) {
      return 1;
    }

    return Number(latestInvoiceNumberForSeries) + 1;
  }

  async getInvoiceWithDetails(invoiceId: number) {
    const models = initModels(sequelize);

    const invoice: Invoice = await models.Invoice.findOne(
      {
        where: {
          invoice_id: invoiceId
        },
        include: [
          {model: Partner, as: "buyer", include: [{model: BankAccount, as: 'BankAccounts'}]},
          {model: Partner, as: "client"}
        ]
      }
    );

    const invoiceProducts = await models.InvoiceProduct.findAll(
      {
        where: {
          invoice_id: invoiceId
        },
        include: [
          {model: Product, as: "product"}
        ]
      }
    );

    const productList: ProductAttributes[] = [];

    invoiceProducts.forEach((invoiceProduct: InvoiceProduct) => {
      const product: ProductAttributes = invoiceProduct.product;

      product.quantity = invoiceProduct.quantity;
      product.purchase_price = invoiceProduct.selling_price;

      productList.push(product)
    });

    return {invoice, productList};
  }

  async updateInvoice(invoiceUpdate: any) {
    const models = initModels(sequelize);

    const existingInvoice = await models.Invoice.findOne({
      where: {
        invoice_id: invoiceUpdate.invoice_id
      }
    });

    existingInvoice.client_id = invoiceUpdate.client;
    existingInvoice.created_at_utc = new Date(invoiceUpdate.created_at).toUTCString();
    existingInvoice.deadline_at_utc = new Date(invoiceUpdate.deadline_at).toUTCString();
    existingInvoice.series = invoiceUpdate.series;
    existingInvoice.number = invoiceUpdate.number;
    existingInvoice.status = invoiceUpdate.status;
    existingInvoice.sent_status = invoiceUpdate.sent_status;

    try {
      await existingInvoice.save();
    } catch (err) {
      console.error(err);
      return {errorCode: 400, message: err}
    }

    return {message: "Invoice update successful"}
  }

  async addInvoiceProduct(productData: InvoiceProductInformation) {
    const models = initModels(sequelize);

    const existingProduct: Product = await models.Product.findOne({
      where: {
        product_id: productData.product_id
      }
    });

    const existingInvoice: Invoice = await models.Invoice.findOne({
      where: {
        invoice_id: productData.invoice_id
      }
    });

    const existingInvoiceProduct: InvoiceProduct = await models.InvoiceProduct.findOne({
      where: {
        product_id: productData.product_id,
        invoice_id: productData.invoice_id
      }
    });

    let invoiceProduct = existingInvoiceProduct;

    if (existingInvoiceProduct) {
      invoiceProduct.quantity = Number(existingInvoiceProduct.quantity) + Number(productData.quantity);
      switch (existingInvoice.type) {
        case 'received': {
          existingProduct.quantity = Number(existingProduct.quantity) + Number(productData.quantity);

          break;
        }

        case 'issued': {
          existingProduct.quantity = Number(existingProduct.quantity) - Number(productData.quantity);

          break;
        }

        default: {
          console.error(`Invalid invoice type, ${existingInvoice}`)
          return {message: 'Invalid invoice type'}
        }
      }
    } else {
      invoiceProduct = await models.InvoiceProduct.create({
        product_id: existingProduct.product_id,
        invoice_id: existingInvoice.invoice_id,
        quantity: productData.quantity,
        selling_price: productData.purchase_price,
        sold_at_utc: new Date().toUTCString()
      })
    }

    const productVat = parseFloat((((invoiceProduct.selling_price * 19) / 100) * invoiceProduct.quantity).toFixed(2))
    existingInvoice.total_vat = Number((Number(existingInvoice.total_vat) + productVat).toFixed(2));
    existingInvoice.total_price = Number(Number(existingInvoice.total_price) + parseFloat((invoiceProduct.selling_price * invoiceProduct.quantity).toFixed(2)));
    existingInvoice.total_price_incl_vat = Number((existingInvoice.total_vat + existingInvoice.total_price).toFixed(2));

    try {
      await existingInvoice.save();
      await invoiceProduct.save();
      await existingProduct.save();

      return {message: "Invoice product successfully updated"};
    } catch (error) {
      console.error(error);
    }
  }

  async removeInvoiceProduct(productData: InvoiceProductInformation) {
    const models = initModels(sequelize);

    const existingInvoiceProduct: InvoiceProduct = await models.InvoiceProduct.findOne({
      where: {
        product_id: productData.product_id,
        invoice_id: productData.invoice_id
      }
    });

    const existingInvoice: Invoice = await models.Invoice.findOne({
      where: {
        invoice_id: productData.invoice_id
      }
    });

    const existingProduct: Product = await models.Product.findOne({
      where: {
        product_id: productData.product_id
      }
    })

    try {
      const productVat = parseFloat((((existingInvoiceProduct.selling_price * 19) / 100) * existingInvoiceProduct.quantity).toFixed(2))

      existingInvoice.total_vat = Number((Number(existingInvoice.total_vat) - productVat).toFixed(2));
      existingInvoice.total_price = Number(Number(existingInvoice.total_price) - parseFloat((existingInvoiceProduct.selling_price * existingInvoiceProduct.quantity).toFixed(2)));
      existingInvoice.total_price_incl_vat = Number((existingInvoice.total_vat + existingInvoice.total_price).toFixed(2));

      await existingInvoice.save();
      await existingInvoiceProduct.destroy();
    } catch (error) {
      console.error(error);
    }

    if (existingProduct.type === 'service') {
      return {message: "Invoice successfully updated"};
    }

    if (existingInvoice.type === 'issued') {
      existingProduct.quantity = Number(existingProduct.quantity) + existingInvoiceProduct.quantity;
    }

    if (existingInvoice.type === 'received') {
      existingProduct.quantity = Number(existingProduct.quantity) - existingInvoiceProduct.quantity;
    }

    try {
      await existingProduct.save();
      return {message: "Invoice and product successfully updated"}
    } catch (error) {
      console.error(error);
    }
  }

  async checkInvoiceProductExists(invoiceId: number, productId: number) {
    const models = initModels(sequelize);

    return !!(await models.InvoiceProduct.findOne({
      where: {
        product_id: productId,
        invoice_id: invoiceId
      }
    }))
  }
}

export default new InvoiceService();
