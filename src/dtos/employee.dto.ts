export interface EmployeeAddDto {
  partner_id?: number;
  first_name: string;
  last_name?: string;
  nationality?: string;
  social_security_number: string;
  ssn_series: string;
  ssn_number: number;
  phone?: string;
  email?: string;
  town: string;
  address: string;
  ssn_provider: string;
  ssn_start_date: string;
  ssn_end_date: string;
  salar_a?: number;
  salar_n?: number;
}
