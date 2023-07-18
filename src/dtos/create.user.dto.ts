import { Roles } from "../common/enums/roles";

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
}
