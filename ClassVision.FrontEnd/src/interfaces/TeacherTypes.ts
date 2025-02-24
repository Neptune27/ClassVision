import { CommonType } from "./CommonType";

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
