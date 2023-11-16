import { InvoiceProduct } from "../../../db/models/InvoiceProduct";

const generateBunuriTransportate = async (
  invoiceProducts: InvoiceProduct[],
  codScopOperatiune: string,
) => {
  return await Promise.all(
    invoiceProducts.map(async (invoiceProduct) => {
      return {
        denumireMarfa: invoiceProduct.product.product_name,
        codScopOperatiune: codScopOperatiune,
        cantitate: invoiceProduct.product.quantity,
        // valoare dummy deoarece codul din baza de date nu era valid
        // codUnitateMasura: "OPM",
        codUnitateMasura: invoiceProduct.unit_of_measure.toLocaleUpperCase(),
        greutateBruta: invoiceProduct.product.quantity,
        // Ramane aceeasi cu greutateBruta sau o sa primim din frontend?
        greutateNeta: invoiceProduct.product.quantity,
        codTarifar: invoiceProduct.product.nc8Code.code,
        // Purchase price este valoarea lei fara tva?
        valoareLeiFaraTva: invoiceProduct.product.purchase_price
      };
    })
  );
};

export default generateBunuriTransportate;
