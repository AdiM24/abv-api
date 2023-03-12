import {UpdateAddressDto} from "./update.partner.dto";
import {CreateAddressDto} from "./create.partner.dto";
import {AddressAttributes} from "../db/models/Address";

export interface CreateNoticeDto {
  car_registration_number?: string;
  pickup_address_id?: AddressAttributes;
  dropoff_address_id?: AddressAttributes;
  noticeProducts: any;
}

export interface NoticeDto {
  notice_id: number;
  invoice_id?: number;
  created_at_utc: Date;
  car_registration_number?: string;
  employee_id: number;
  pickup_address: UpdateAddressDto;
  dropoff_address: UpdateAddressDto;
  client_id?: number;
  buyer_id?: number;
  notice_series: string;
  notice_number: number;
}