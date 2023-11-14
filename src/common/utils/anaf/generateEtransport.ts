import { Invoice } from "../../../db/models/init-models";
import formateDate from "./formateDate";
import generateBunuriTransportate from "./generateBunuriTransportate";
import codJudet from "./generateCodJudet";

const generateEtransport = async (
  invoice: Invoice,
  codTarifar: string,
  codScopOperatiune: string[],
  tokenAnaf: string
) => {
  const generatedEtransport = {
    // cif-ul trebuie sa aiba drept in SPV
    // cif: partner.unique_identification_number,
    cif: "16912984",
    codTipOperatiune: "30",
    bunuriTransportate: await generateBunuriTransportate(invoice.InvoiceProducts, codTarifar, codScopOperatiune),
    partenerComercial: {
      codTara: "RO",
      denumire: invoice.client.name,
      cod: invoice.client.unique_identification_number.split('RO')[1]
    },
    dateTransport: {
      numarVehicul: invoice.order_reference.car_reg_number.split(' ').join(''),
      codTaraOrgTransport: "RO",
      denumireOrgTransport: invoice.order_reference.OrderDetails[0].company,
      dataTransport: formateDate(invoice.order_reference.OrderDetails[0].date_to),
      codOrgTransport: invoice.client.unique_identification_number.split('RO')[1]
    },
    locStartTraseuRutier: {
      codJudet: `${await codJudet(invoice.pickup_address.county) + 1}`,
      denumireLocalitate: invoice.pickup_address.city,
      denumireStrada: invoice.pickup_address.address
    },
    locFinalTraseuRutier: {
      codJudet: `${await codJudet(invoice.drop_off_address.county) + 1}`,
      denumireLocalitate: invoice.drop_off_address.city,
      denumireStrada: invoice.drop_off_address.address
    },
    documenteTransport: [{
      tipDocument: "30",
      dataDocument: formateDate(invoice.order_reference.OrderDetails[0].date_from)
    }],
    token: tokenAnaf
  };

  return generatedEtransport;
};

export default generateEtransport;
