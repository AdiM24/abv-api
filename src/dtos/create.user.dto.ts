export interface CreateUserDto {
    email: string;
    password: string;
    first_name?: string;
    last_name?: string;
    phone: string;
}
