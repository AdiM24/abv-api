export interface UpdatePartnerDto {
    name: string;
    unique_identification_number: string;
    trade_register_registration_number: string;
    address: string;
    credit: number;
    remaining_credit: number;
    vat_payer: boolean;
    vat_split: boolean;
    vat_collection: boolean;
    invoice_deadline_days: number;
    credit_exceedance_percentage: number;
    modified_at_utc?: Date;
  }
  
  export interface UpdateContactDto {
    contact_id: number;
    contact_email: string;
    phone?: string;
    first_name?: string;
    last_name?: string;
    personal_identification_number?: string;
    car_registration_number?: string;
    department?: string;
    modified_at_utc?: Date;
    partner_id?: number;
  }
  
  export interface UpdateAddressDto {
    address_id: number;
    county: string;
    country: string;
    city: string;
    address: string;
    partner_id?: number;
  }
  
  export interface UpdateBankAccountDto {
    bank_account_id: number;
    iban: string;
    bank_name: string;
    currency: string;
    partner_id?: number;
  }
  