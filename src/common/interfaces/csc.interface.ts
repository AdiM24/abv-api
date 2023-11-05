export interface ICountry extends Document {
    id: number;
    name: string;
    iso2: string;
    phonecode: string;
    emoji: string;
}

export type ICounty = ICountry
export type ICity = ICounty
