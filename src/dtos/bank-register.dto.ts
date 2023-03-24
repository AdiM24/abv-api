export interface BankRegisterAddDto {
  iban: string
  balance: number
  partner_id: number
  currency: "EUR" | "RON"
}