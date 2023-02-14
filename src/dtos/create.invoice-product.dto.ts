export interface CreateInvoiceProductDto {
  invoice_id: number;
  product_id: number;
  quantity: number;
  selling_price: number;
  sold_at_utc: string;
}

export interface InvoiceProductInformation {
  invoice_id: number;
  product_id: number;
  quantity: number;
  selling_price?: number;
  purchase_price?: number;
}