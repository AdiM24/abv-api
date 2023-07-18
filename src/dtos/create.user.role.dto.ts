import { Roles } from "../common/enums/roles";

export interface CreateUserRoleDto {
    role: Roles;
    user_id: number;
}
