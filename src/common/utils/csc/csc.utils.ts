import { ICounty } from '../../interfaces/csc.interface';

export const sanitizeCountyName = (county: ICounty): ICounty => {
    county.name = county.name.replace(/County/g, '').trim();
    county.name = county.name.replace(/ă/g, 'a').trim();
    county.name = county.name.replace(/â/g, 'a').trim();
    county.name = county.name.replace(/ș/g, 's').trim();
    county.name = county.name.replace(/ț/g, 't').trim();
    county.name = county.name.replace(/î/g, 'i').trim();

    if (county.name === 'Bucharest') {
        county.name = 'Bucuresti';
    }

    return {
        name: county.name,
        iso2: county.iso2,
    } as ICounty;
};
