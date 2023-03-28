export interface UserDto {
    email: string;
    first_name?: string;
    last_name?: string;
    phone: string;
    created_at_utc: Date;
}

export interface CreateUserPartnerEmail {
    user_id: number;
    partner_id: number;
    partner_email: string;
    password: string;
    smtp: string;
}