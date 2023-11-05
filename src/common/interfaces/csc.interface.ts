export interface ICountry extends Document {
    id: number;
    name: string;
    iso2: string;
    phonecode: string;
    emoji: string;
}

export interface ICounty extends ICountry {}
export interface ICity extends ICounty {}
