import { Roles } from "../common/enums/roles";

export interface UpdateUserRoleDto {
    user_role_id: number;
    role: Roles;
}
