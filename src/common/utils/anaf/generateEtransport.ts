import { Invoice } from "../../../db/models/init-models";
// import formateDate from "./formateDate";
import generateBunuriTransportate from "./generateBunuriTransportate";
import codJudet from "./generateCodJudet";

const generateEtransport = async (
  invoice: Invoice,
  codScopOperatiune: string,
  tokenAnaf: string,
  greutateBruta: number,
  greutateNeta: number
) => {

  const generatedEtransport = {
    // cif-ul trebuie sa aiba drept in SPV
    // cif: invoice.client.unique_identification_number.toLowerCase().replace('ro', '').trim(),
    cif: "16912984",
    codTipOperatiune: "30",
    bunuriTransportate: await generateBunuriTransportate(invoice.InvoiceProducts, codScopOperatiune, greutateBruta, greutateNeta),
    partenerComercial: {
      codTara: "RO",
      denumire: invoice.client.name,
      cod: invoice.client.unique_identification_number.toLowerCase().replace('ro', '').trim()
    },
    dateTransport: {
      numarVehicul: invoice.car_reg_number?.split(' ').join(''),
      codTaraOrgTransport: "RO",
      denumireOrgTransport: invoice.client.name,
      dataTransport: invoice.created_at_utc,
      codOrgTransport: invoice.client.unique_identification_number.toLowerCase().replace('ro', '').trim()
    },
    locStartTraseuRutier: {
      codJudet: `${await codJudet(invoice.pickup_address.county)}`,
      denumireLocalitate: invoice.pickup_address.city,
      denumireStrada: invoice.pickup_address.address
    },
    locFinalTraseuRutier: {
      codJudet: `${await codJudet(invoice.drop_off_address.county)}`,
      denumireLocalitate: invoice.drop_off_address.city,
      denumireStrada: invoice.drop_off_address.address
    },
    documenteTransport: [{
      tipDocument: "30",
      dataDocument: invoice.created_at_utc
    }],
    token: tokenAnaf
  };

  return generatedEtransport;
};

export default generateEtransport;
