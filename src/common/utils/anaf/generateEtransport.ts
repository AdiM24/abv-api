import { InvoiceProduct, Order, OrderDetails, Partner } from "../../../db/models/init-models";
import formateDate from "./formateDate";
import generateBunuriTransportate from "./generateBunuriTransportate";

const generateEtransport = async (
  invoiceProducts: InvoiceProduct[],
  orderDetails: OrderDetails,
  partner: Partner,
  order: Order,
  codTarifar: string[],
  codScopOperatiune: string[],
  locStart: any,
  locFinal: any
) => {

  const generatedEtransport = {
    // cif-ul trebuie sa aiba drept in SPV
    // cif: partner.unique_identification_number,
    cif: "16912984",
    codTipOperatiune: "30",
    bunuriTransportate: await generateBunuriTransportate(invoiceProducts, codTarifar, codScopOperatiune),
    partenerComercial: {
      codTara: "RO",
      denumire: partner.name,
      cod: partner.unique_identification_number.split('RO')[1]
    },
    dateTransport: {
      numarVehicul: order.car_reg_number.split(' ').join(''),
      codTaraOrgTransport: "RO",
      denumireOrgTransport: orderDetails.company,
      dataTransport: formateDate(orderDetails.date_to),
      codOrgTransport: partner.unique_identification_number.split('RO')[1]
    },
    locStartTraseuRutier: {
      codJudet: locStart.codJudet,
      denumireLocalitate: locStart.localitate,
      denumireStrada: locStart.strada
    },
    locFinalTraseuRutier: {
      codJudet: locFinal.codJudet,
      denumireLocalitate: locFinal.localitate,
      denumireStrada: locFinal.strada
    },
    documenteTransport: [{
      tipDocument: "30",
      dataDocument: formateDate(orderDetails.date_from)
    }]
  };

  return generatedEtransport;
};

export default generateEtransport;
