export interface CreateProductDto {
  product_name: string;
  quantity: number;
  purchase_price: number;
  selling_price: number;
  vat: number;
  unit_of_measure: string;
  type: 'service' | 'goods',
  material: string;
}
