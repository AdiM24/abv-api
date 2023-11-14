import cscService from "../../../services/csc.service";
import { Invoice } from "../../../db/models/init-models";

const generateInvoice = async (
  productList: any[],
  invoice: Invoice,
  supplier: any,
  customer: any,
  classifiedTaxCategory: string,
  taxPercent: string,
  tokenAnaf: string
) => {
  const invoiceLines = productList.map(product => {
    return {
      unitCode: product.unit_of_measure,
      invoicedQuantity: product.dataValues.quantity,
      lineExtensionAmount: product.dataValues.purchase_price,
      name: product.product_name,
      classifiedTaxCategory: classifiedTaxCategory,
      classifiedTaxPercent: product.vat,
      priceAmount: product.dataValues.purchase_price,
      baseQuantity: product.dataValues.quantity
    }
  });

  const newInvoice = {
    // cif-ul trebuie sa aiba drept in SPV
    // cif: supplier.unique_identification_number,
    cif: "16912984",
    headers: {
      invoiceId: invoice.invoice_id,
      issueDate: invoice.created_at_utc,
      dueDate: (invoice.deadline_at_utc ? invoice.deadline_at_utc : "2023-12-31"),
      currencyCode: invoice.currency
    },
    supplierInfo: {
      supplierName: supplier.name,
      supplierStreet: supplier.address,
      supplierCity: supplier.Addresses[0].dataValues.city,
      // todo
      supplierCountrySubentity: await cscService.getCounty(supplier.Addresses[0].dataValues.county),
      supplierCountryCode: "RO",
      supplierId: supplier.unique_identification_number,
      supplierLegallyInfo: supplier.trade_register_registration_number
    },
    customerInfo: {
      customerName: customer.name,
      customerStreet: customer.address,
      customerCity: customer.Addresses[0].dataValues.city,
      // todo
      customerCountrySubentity: await cscService.getCounty(customer.Addresses[0].dataValues.county),
      customerCountryCode: "RO",
      customerId: customer.unique_identification_number,
      customerRegistrationName: customer.trade_register_registration_number
    },
    paymentMeans: {
      paymentMeansCode: "31"
    },
    taxTotal: {
      taxAmount: invoice.total_vat,
      currency: invoice.currency,
      taxSubtotal: {
        taxableAmount: invoice.total_price,
        subtotalTaxAmount: invoice.total_vat,
        taxCategory: classifiedTaxCategory,
        taxPercent: taxPercent
      }
    },
    legalMonetaryTotal: {
      lineExtensionAmount: invoice.total_price,
      taxExclusiveAmount: invoice.total_price,
      taxInclusiveAmount: invoice.total_price_incl_vat,
      payableAmount: invoice.total_price_incl_vat
    },
    invoiceLines: invoiceLines,
    token: tokenAnaf
  };

  return newInvoice;
};

export default generateInvoice;
