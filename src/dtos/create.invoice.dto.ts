import {CreateInvoiceProductDto} from "./create.invoice-product.dto";

export interface CreateInvoiceDto {
  client_id: number;
  buyer_id: number;
  number: number;
  series: string;
  deadline_at_utc: Date;
  created_at_utc: Date;
  status: 'paid' | 'overdue' | 'incomplete payment' | 'unpaid';
  type: 'proforma' | 'received' | 'issued';
  sent_status: 'sent' | 'not sent';
  products: CreateInvoiceProductDto[];
}