import { CommonType, VisibleNameType } from "./CommonType";

export interface TeacherType extends CommonType, TeacherModifyType {
}

export const enum EGender {
    OTHER = 0,
    MALE = 1,
    FEMALE = 2
}

export type TeacherModifyType = {
    id: string,
    userId: string,
    firstName: string,
    lastName: string,
    gender: EGender,
    birthday: string,
    hireDate: string,
    phoneNumber: string,
    address: string,
}
export const TeacherVisibleName: VisibleNameType<TeacherType> = {
    createdAt: "Created At",
    isActive: "Is Active",
    lastUpdated: "Last updated",
    id: "Id",
    userId: "User Id",
    firstName: "First Name",
    lastName: "Last Name",
    gender: "Gender",
    birthday: "Birthday",
    hireDate: "Hire Date",
    phoneNumber: "Phone Number",
    address: "Address",
}