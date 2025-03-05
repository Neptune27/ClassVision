import { CommonType, ExcludeCommonType, VisibleNameType } from "./CommonType";
import { EnrollmentType } from "./EnrollmentTypes";

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
    enrollments: EnrollmentType[]
}
export const StudentVisibleName: VisibleNameType<StudentType> = {
    createdAt: "Created At",
    isActive: "Is Active",
    lastUpdated: "Last updated",
    id: "Id",
    firstName: "First Name",
    lastName: "Last Name",
    gender: "Gender",
    birthday: "Birthday",
    enrollAt: "Enroll At",
    phoneNumber: "Phone Number",
    address: "Address",
    media: "Media",
    enrollments: "Enrollments"
}

