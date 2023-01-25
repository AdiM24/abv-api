export interface UpdateProductDto {
  product_id: number;
  product_name: string;
  quantity: number;
  purchase_price: number;
  selling_price: number;
  vat: number;
  created_at_utc: Date;
  modified_at_utc: Date;
}
