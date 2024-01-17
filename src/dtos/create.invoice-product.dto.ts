export interface CreateInvoiceProductDto {
  vat?: number;
  invoice_id: number;
  product_id: number;
  quantity: number;
  selling_price: number;
  sold_at_utc: string;
  unit_of_measure?: string;
}

export interface InvoiceProductInformation {
  vat: number;
  invoice_id: number;
  product_id: number;
  quantity: number;
  selling_price?: number;
  purchase_price?: number;
  unit_of_measure?: string;
}

export interface UpdateInvoiceProduct {
  invoice_product_id: number;
  invoice_id: number;
  product_id: number;
  quantity: number;
  selling_price?: number;
  purchase_price?: number;
  unit_of_measure?: string;
}
