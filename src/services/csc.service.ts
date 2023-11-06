import dotenv from 'dotenv';
import { ICounty } from '../common/interfaces/csc.interface';
import { sanitizeCountyName } from '../common/utils/csc/csc.utils';

dotenv.config();

const cscHeader = process.env.CSC_HEADER || '';
const cscApi = process.env.CSC_API || '';
const cscBaseUri = process.env.CSC_BASE_URI || '';

class CSCService {
    async getCounty(county: string) {
        // eslint-disable-next-line no-async-promise-executor
        return new Promise(async (resolve, reject) => {
            try {
                const countyRegex = new RegExp(county, 'i');

                const headers = new Headers();
                headers.append(cscHeader, cscApi);

                const requestOptions = {
                    method: 'GET',
                    headers: headers,
                };

                await fetch(`${cscBaseUri}countries/ro/states`, requestOptions)
                    .then((response) => response.text())
                    .then((result) => {
                        const countiesParsed: Array<ICounty> = JSON.parse(result);
                        const counties = countiesParsed
                            .map((county) => {
                                return sanitizeCountyName(county);
                            })
                            .sort((a, b) => (a.name > b.name ? 1 : -1));

                        const countyFound = counties.find(
                            (el) => el.name.match(countyRegex) || el.name.includes(county)
                        );

                        resolve(`RO-${countyFound.iso2}`);
                    })
                    .catch((err: string) => {
                        reject(`${err}`);
                    });
            } catch (error) {
                reject(`${error}`);
            }
        });
    }
}

export default new CSCService();
