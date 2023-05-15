interface CreateOrderDto {
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
}

interface CreateOrderDetailsDto {
  company: string;
  address: string;
  location: string;
  reference: string;
  date_from: Date;
  date_to: Date;
  remarks: string;
  type: 'PICKUP' | 'DROPOFF';
}