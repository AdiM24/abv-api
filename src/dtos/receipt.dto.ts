export interface CreateReceiptDto {
  invoice_id: number
  buyer_partner_id: number
  seller_partner_id: number
  currency: "RON" | "EUR"
  total_price: number
  vat_price: number
  description: string
  series_number: number
  series_type_id: number
  issued_date: string
  cash_register_id: number
}

export interface RemoveReceiptDto {
  receipt_id: string
  invoice_id: number
  total_price: number
  cash_register_id: number
}