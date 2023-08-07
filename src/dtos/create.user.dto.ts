import { Roles } from "../common/enums/roles";
import {Partner} from "../db/models/Partner";
import {AutoFleet} from "../db/models/AutoFleet";

export interface CreateUserDto {
    email: string;
    password: string;
    first_name?: string;
    last_name?: string;
    phone: string;
    id_card_series?: string;
    id_card_number?: string;
    id_card_issued_by?: string;
    role: Roles;
    partner: Partner;
    vehicle: AutoFleet;
}

