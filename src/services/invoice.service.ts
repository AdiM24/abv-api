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
      include: [{model: Partner, as: 'buyer'}]
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
      include: [{model: Partner, as: 'buyer'}]
    });
  }

  async createInvoice(invoiceToAdd: CreateInvoiceDto, models: any) {
    let createdInvoice: Invoice;

    invoiceToAdd.series = invoiceToAdd.series.toUpperCase();
    invoiceToAdd.deadline_at_utc = invoiceToAdd.deadline_at_utc ? invoiceToAdd.deadline_at_utc : null;

    try {
      createdInvoice = await models.Invoice.create(invoiceToAdd);
    } catch (err) {
      console.error(err);
    }

    return createdInvoice
  }

  async addInvoice(invoiceToAdd: CreateInvoiceDto, decodedJwt: any = undefined) {
    const models = initModels(sequelize);

    console.log(decodedJwt);

    if (invoiceToAdd.type === 'issued') {
      invoiceToAdd.number = await this.findNextSeriesNumber(invoiceToAdd.series, invoiceToAdd.type);
    }

    if (invoiceToAdd.type === 'notice') {
      invoiceToAdd.series = 'XM';
      invoiceToAdd.number = await this.findNextSeriesNumber(invoiceToAdd.series, invoiceToAdd.type);
      invoiceToAdd.client_id = invoiceToAdd.pickup_address.partner_id;
      invoiceToAdd.buyer_id = invoiceToAdd.drop_off_address.partner_id;
      invoiceToAdd.pickup_address_id = invoiceToAdd.pickup_address.address_id;
      invoiceToAdd.drop_off_address_id = invoiceToAdd.drop_off_address.address_id;
      invoiceToAdd.car_reg_number = invoiceToAdd.car_reg_number.replace(/ /g,'').toUpperCase();
      invoiceToAdd.driver_name = decodedJwt.name;
      invoiceToAdd.created_at_utc = new Date().toUTCString();
    }

    const createdInvoice = await this.createInvoice(invoiceToAdd, models);

    const invoiceProducts: CreateInvoiceProductDto[] = invoiceToAdd.products.map((invoiceProduct: CreateInvoiceProductDto) => {
      return {
        invoice_id: createdInvoice.get().invoice_id,
        product_id: invoiceProduct.product_id,
        quantity: parseFloat(Number(invoiceProduct.quantity).toFixed(2)),
        selling_price: parseFloat(Number(invoiceProduct.selling_price).toFixed(2)),
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

    createdInvoice.total_price_incl_vat = parseFloat((createdInvoice.total_vat + createdInvoice.total_price).toFixed(2));

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

  async findNextSeriesNumber(series: string, type: string) {
    const models = initModels(sequelize);

    const latestInvoiceNumberForSeries = (await models.Invoice.findOne({
      where: {
        series: series.toUpperCase(),
        type: type
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

      product.quantity = parseFloat(Number(invoiceProduct.quantity).toFixed(2));
      product.purchase_price = parseFloat(Number(invoiceProduct.selling_price).toFixed(2));

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

    existingInvoice.buyer_id = invoiceUpdate.buyer;
    existingInvoice.created_at_utc = new Date(invoiceUpdate.created_at).toUTCString();
    existingInvoice.deadline_at_utc = invoiceUpdate.deadline_at ? new Date(invoiceUpdate.deadline_at).toUTCString() : null;
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
      invoiceProduct.quantity = parseFloat((Number(existingInvoiceProduct.quantity) + Number(productData.quantity)).toFixed(2));
      switch (existingInvoice.type) {
        case 'received': {
          existingProduct.quantity = parseFloat((Number(existingProduct.quantity) + Number(productData.quantity)).toFixed(2));

          break;
        }

        case 'issued': {
          existingProduct.quantity = parseFloat((Number(existingProduct.quantity) - Number(productData.quantity)).toFixed(2));

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
        quantity: parseFloat(Number(productData.quantity).toFixed(2)),
        selling_price: parseFloat(Number(productData.purchase_price).toFixed(2)),
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
      existingProduct.quantity = parseFloat((Number(existingProduct.quantity) + existingInvoiceProduct.quantity).toFixed(2));
    }

    if (existingInvoice.type === 'received') {
      existingProduct.quantity = parseFloat((Number(existingProduct.quantity) - existingInvoiceProduct.quantity).toFixed(2));
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

  async removeInvoice(invoiceId: number) {
    const models = initModels(sequelize);

    const existingInvoice = await models.Invoice.findOne({
      where: {
        invoice_id: invoiceId
      },
    });

    const invoiceProducts = await models.InvoiceProduct.findAll({
      where: {
        invoice_id: invoiceId,
      }
    });

    for await (const invoiceProduct of invoiceProducts) {
      const product = await models.Product.findOne({
        where: {
          product_id: invoiceProduct.product_id,
        }
      });

      if (product.type === 'goods') {

        if (existingInvoice.type === 'received') {
          product.quantity = parseFloat((Number(product.quantity) - Number(invoiceProduct.quantity)).toFixed(2));
        }

        if (existingInvoice.type === 'issued') {
          product.quantity = parseFloat((Number(product.quantity) + Number(invoiceProduct.quantity)).toFixed(2));
        }
      }

      try {
        await product.save();
        await models.InvoiceProduct.destroy({
          where: {
            invoice_id: invoiceProduct.invoice_id,
            product_id: invoiceProduct.product_id
          }
        });
      } catch (err) {
        console.error(err);
      }
    }

    try {
      await existingInvoice.destroy();
      return {code: 200, message: `Invoice successfully deleted`}
    } catch (err) {
      console.error(err);
    }

  }

  async getLatestInvoiceBySeries(invoiceSeries: string) {
    const models = initModels(sequelize);

    const latestInvoicesFromSeries = await models.Invoice.findAll({
      where: {
        series: invoiceSeries
      },
      order: [
        ['created_at_utc', 'DESC']
      ]
    });

    if (!latestInvoicesFromSeries?.length) {
      return null
    }

    return latestInvoicesFromSeries[0];
  }
}

export default new InvoiceService();
