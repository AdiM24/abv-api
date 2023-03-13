export interface CreateUserInvoiceSeriesDto {
  invoice_type: 'notice' | 'issued';
  series: string;
  default: boolean;
}