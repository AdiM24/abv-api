import { InvoiceProduct } from "../../../db/models/InvoiceProduct";

const generateBunuriTransportate = async (
  invoiceProducts: InvoiceProduct[],
  codScopOperatiune: string,
  greutateBruta: number,
  greutateNeta: number
) => {
  return await Promise.all(
    invoiceProducts.map(async (invoiceProduct) => {
      let quantity = Number(invoiceProduct.product.quantity);

      if (quantity > (greutateBruta - greutateNeta)) {
        quantity = greutateBruta - greutateNeta;
      } else if (quantity < (greutateBruta - greutateNeta)) {
        greutateBruta = quantity + greutateNeta;
      }

      return {
        denumireMarfa: invoiceProduct.product.product_name,
        codScopOperatiune: codScopOperatiune,
        cantitate: quantity*1000,
        // valoare dummy deoarece codul din baza de date nu era valid
        // codUnitateMasura: "OPM",
        codUnitateMasura: "KGM",
        greutateBruta: greutateBruta*1000,
        greutateNeta: greutateNeta*1000,
        codTarifar: invoiceProduct.product.nc8Code.code,
        // Purchase price este valoarea lei fara tva?
        valoareLeiFaraTva: invoiceProduct.product.purchase_price*1000
      };
    })
  );
};

export default generateBunuriTransportate;
