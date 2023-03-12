export interface CreatePartnerDto {
  name: string;
  unique_identification_number: string;
  trade_register_registration_number: string;
  contact: CreateContactDto;
  address: string;
  bank_account: CreateBankAccountDto;
  credit: number;
  remaining_credit: number;
  vat_payer: boolean;
  vat_split: boolean;
  vat_collection: boolean;
  invoice_deadline_days: number;
  credit_exceedance_percentage: number;
  modified_at_utc?: Date;
  address_point: CreateAddressDto;
}

export interface CreateContactDto {
  contact_email: string;
  phone: string;
  first_name: string;
  last_name: string;
  personal_identification_number: string;
  car_registration_number: string;
  department: string;
  modified_at_utc?: Date;
  partner_id?: number;
}

export interface CreateAddressDto {
  county: string;
  country: string;
  city: string;
  address: string;
  modified_at_utc: Date;
  partner_id?: number;
  nickname?: string;
}

export interface CreateBankAccountDto {
  iban: string;
  bank_name: string;
  currency: string;
  partner_id?: number;
}
