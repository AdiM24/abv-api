import {CreateInvoiceProductDto} from "./create.invoice-product.dto";

export interface CreateInvoiceDto {
  client_id: number;
  buyer_id: number;
  number: number;
  series: string;
  deadline_at_utc: string;
  created_at_utc: string;
  status: 'paid' | 'overdue' | 'incomplete payment' | 'unpaid';
  type: 'proforma' | 'received' | 'issued' | 'notice';
  sent_status: 'sent' | 'not sent';
  pickup_address: any;
  drop_off_address: any;
  products: CreateInvoiceProductDto[];
  driver_name: string;
  car_reg_number: string;
  pickup_address_id: number;
  drop_off_address_id: number;
}