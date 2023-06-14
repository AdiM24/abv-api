import {sequelize} from "../db/sequelize";
import {initModels} from "../db/models/init-models";
import * as http from "http";
import * as https from "https";
import {request} from "express";
import axios from "axios";

class ETransportService {
  countyCodes = [
    {code: 1, county: 'Alba'},
    {code: 2, county: 'Arad'},
    {code: 3, county: 'Arges'},
    {code: 4, county: 'Bacau'},
    {code: 5, county: 'Bihor'},
    {code: 6, county: 'Bistrita Nasaud'},
    {code: 7, county: 'Botosani'},
    {code: 8, county: 'Brasov'},
    {code: 9, county: 'Braila'},
    {code: 10, county: 'Buzau'},
    {code: 11, county: 'Caras Severin'},
    {code: 12, county: 'Cluj'},
    {code: 13, county: 'Constanța'},
    {code: 14, county: 'Covasna'},
    {code: 15, county: 'Dambovita'},
    {code: 16, county: 'Dolj'},
    {code: 17, county: 'Galati'},
    {code: 18, county: 'Gorj'},
    {code: 19, county: 'Harghita'},
    {code: 20, county: 'Hunedoara'},
    {code: 21, county: 'Ialomita'},
    {code: 22, county: 'Iasi'},
    {code: 23, county: 'Ilfov'},
    {code: 24, county: 'Maramures'},
    {code: 25, county: 'Mehedinti'},
    {code: 26, county: 'Mures'},
    {code: 27, county: 'Neamt'},
    {code: 28, county: 'Olt'},
    {code: 29, county: 'Prahova'},
    {code: 30, county: 'Satu Mare'},
    {code: 31, county: 'Salaj'},
    {code: 32, county: 'Sibiu'},
    {code: 33, county: 'Suceava'},
    {code: 34, county: 'Teleorman'},
    {code: 35, county: 'Timis'},
    {code: 36, county: 'Tulcea'},
    {code: 37, county: 'Vaslui'},
    {code: 38, county: 'Valcea'},
    {code: 39, county: 'Vrancea'},
    {code: 40, county: 'Bucuresti'},
    {code: 51, county: 'Calarasi'},
    {code: 52, county: 'Giurgiu'}
  ]

  async getCodeByCounty(county: string) {
    return this.countyCodes.find((countyCode) =>
      countyCode.county.toLowerCase().trim() === county.toLowerCase().trim())
  }

  async generateETransport(invoice_id: number, eTransportSettings: any) {
    const models = initModels(sequelize);

    // const invoiceData = await models.Invoice.findOne({
    //   where: {
    //     invoice_id: invoice_id
    //   },
    //   include: [
    //     {},
    //     {},
    //     {},
    //     {}
    //   ]
    // });

    const productList = [
      {
        codScopOperatiune: '101',
        codTarifar: '???',
        denumireMarfa: 'Nume produs',
        cantitate: '2500',
        codUnitateMasura: 'KGM',
        greutateNeta: '2500',
        greutateBruta: '2500',
        valoareLeiFaraTva: '2500'
      }
    ]
    const transportData = {
      nrVehicul: 'ABC123DEF',
      codTaraOrgTransport: "RO",
      codOrgTransport: "cui firma",
      denumireOrgTransport: "nume firma",
      dataTransport: "2023-10-22"
    }
    const locations = [
      {
        codJudet: "13",
        denumireLocalitate: "Constanta",
        denumireStrada: "STR Strazilor",
      },
      {
        codJudet: "13",
        denumireLocalitate: "Constanta",
        denumireStrada: "STR Strazilor",
      }
    ]

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
    <eTransport xmlns="mfp:anaf:dgti:eTransport:declaratie:v2"
      xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
      xsi:schemaLocation="mfp:anaf:dgti:eTransport:declaratie:v2 file:/D:/formInteractive/_inLucru/_proiecte/eTransport/final/schema_ETR_v2_20221215.xsd"
      codDeclarant="90000650">
      <notificare codTipOperatiune="30">
        ${productList.map((product: any) => (
      `<bunuriTransportate codScopOperatiune="${101}" codTarifar="${'08031010'}" denumireMarfa="${product.denumireMarfa}" cantitate="${product.cantitate}" codUnitateMasura="${product.codUnitateMasura}" greutateNeta="${product.greutateNeta}" greutateBruta="${product.greutateBruta}" valoareLeiFaraTva="${product.valoareLeiFaraTva}"/>`
    ))}
        <partenerComercial codTara="RO" cod="90000634" denumire="TEST-90000634"/>
        <dateTransport nrVehicul="${transportData.nrVehicul}" codTaraOrgTransport="RO" codOrgTransport="${transportData.codOrgTransport}" denumireOrgTransport="${transportData.codOrgTransport}" dataTransport="${transportData.dataTransport}"/>
        <locStartTraseuRutier>
          <locatie codJudet="${locations[0].codJudet}" denumireLocalitate="${locations[0].denumireLocalitate}" denumireStrada="${locations[0].denumireStrada}"/>
        </locStartTraseuRutier>
        <locFinalTraseuRutier>
          <locatie codJudet="${locations[1].codJudet}" denumireLocalitate="${locations[1].denumireLocalitate}" denumireStrada="${locations[1].denumireStrada}"/>
        </locFinalTraseuRutier>
          <documenteTransport tipDocument="30" dataDocument="2023-01-05"/>
      </notificare>
    </eTransport>`


    const clientServerOptions = {
      uri: `https://api.anaf.ro/test/ETRANSPORT/ws/v1/upload/ETRANSP/90000650/2`,
      body: xml,
      method: 'POST',
      headers: {
        'Content-Type': 'application/xml'
      }
    }

    axios.post(`https://api.anaf.ro/test/ETRANSPORT/ws/v1/upload/ETRANSP/90000650`, xml, {headers: {'Content-Type': 'application/xml'}}
    ).then((res) => console.log(res))
      .catch((err) => console.log(err));

    return xml;

  }
}

export default new ETransportService();