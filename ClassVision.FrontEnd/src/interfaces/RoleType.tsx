import { VisibleNameType } from "./CommonType"

export interface RoleType {
    id: string,
    userName: string,
    roles: string[]
}

export const RoleVisibleName: VisibleNameType<RoleType> = {
    id: "Id",
    userName: "Username",
    roles: "Roles"
}