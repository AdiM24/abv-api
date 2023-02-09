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
import {CreateInvoiceProductDto} from "../dtos/create.invoice-product.dto";
import {Op, WhereOptions} from "sequelize";
import {getStrictQuery} from "../common/utils/query-utils.service";

class InvoiceService {
  async getInvoices() {
    const models = initModels(sequelize);

    return await models.Invoice.findAll();
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
}

export default new InvoiceService();
