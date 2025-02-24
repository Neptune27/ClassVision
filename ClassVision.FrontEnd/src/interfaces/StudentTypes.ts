import { CommonType, ExcludeCommonType } from "./CommonType";

export interface StudentType extends CommonType, StudentModifyType, StudentEnrollmentType {
}

export const enum EGender {
    OTHER = 0,
    MALE = 1,
    FEMALE = 2
}

export type StudentModifyType = {
    id: string,
    firstName: string,
    lastName: string,
    gender: EGender,
    birthday: string,
    enrollAt: string,
    phoneNumber: string,
    address: string,
    media: string
}

export type StudentEnrollmentType = {
    enrollments: any[]
}

