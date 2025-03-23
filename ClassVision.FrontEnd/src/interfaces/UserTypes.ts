import { CommonType, VisibleNameType } from "./CommonType";

export interface UserType extends UserModifyType {
    id: string
}

export type UserModifyType = {
    userName: string,
    password: string,
    email: string
}
export const UserVisibleName: VisibleNameType<UserType> = {
    id: "Id",
    userName: "Username",
    password: "Password",
    email: "Email"
}