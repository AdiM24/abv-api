export interface UpdateProductDto {
  product_id: number;
  product_name: string;
  quantity: number;
  purchase_price: number;
  selling_price: number;
  vat: number;
  created_at_utc: string;
  modified_at_utc: string;
  material: string;
  type: 'goods' | 'service';
  unit_of_measure: string;
}
