import {OrderDetailsAttributes} from "../db/models/OrderDetails";

export interface CreateOrderDto {
  transporter_id: number;
  buyer_id: number;
  series: string;
  number: number;
  driver_info: string;
  car_reg_number: string;
  package_info: string;
  remarks_transporter: string;
  remarks_buyer: string;
  client_price: number;
  client_currency: 'RON' | 'EUR';
  transporter_price: number;
  transporter_currency: 'RON' | 'EUR';
  order_details: CreateOrderDetailsDto[];
  created_at_utc: Date;
  client_vat: number;
  transporter_vat: number;
  rate: number;
}

export interface CreateOrderDetailsDto {
  company: string;
  address: string;
  location: string;
  reference: string;
  date_from: Date;
  date_to: Date;
  remarks: string;
  type: 'PICKUP' | 'DROPOFF';
}

export interface OrderDto {
  order_id: number;
  client_id: number;
  transporter_id: number;
  buyer_id: number;
  series: string;
  number: number;
  driver_info?: string;
  car_reg_number?: string;
  package_info?: string;
  remarks_transporter?: string;
  remarks_buyer?: string;
  client_price: number;
  client_currency: "RON" | "EUR";
  transporter_price: number;
  transporter_currency: "RON" | "EUR";
  user_id: number;
  created_at_utc: Date;
  client_contact?: string;
  transporter_contact?: string;
  transporter_vat?: number;
  client_vat?: number;
  invoice_generated: boolean;
  profit?: number;
  profit_currency: "RON" | "EUR";
  OrderDetails: OrderDetailsAttributes[]
}