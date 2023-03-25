export interface CashRegisterAddDto {
  name: string
  balance: number
  partner_id: number
  currency: "EUR" | "RON"
}