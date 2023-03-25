export interface CreateUserInvoiceSeriesDto {
  invoice_type: 'notice' | 'issued' | 'order';
  series: string;
  default: boolean;
}