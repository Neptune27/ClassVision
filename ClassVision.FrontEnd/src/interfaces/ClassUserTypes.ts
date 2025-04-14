import { CommonType, ExcludeCommonType, VisibleNameType } from "./CommonType";
import { EnrollmentType } from "./EnrollmentTypes";

export interface ClassUserType extends CommonType, ClassUserModifyType, ClassUserEnrollmentType {
    user?: string
}

export type ClassUserModifyType = {
    id: string,
    firstName: string,
    lastName: string,
    media: string
}

export type ClassUserEnrollmentType = {
    enrollments: EnrollmentType[]
}
export const StudentVisibleName: VisibleNameType<ClassUserType> = {
    createdAt: "Created At",
    isActive: "Is Active",
    lastUpdated: "Last updated",
    id: "Id",
    firstName: "First Name",
    lastName: "Last Name",
    media: "Media",
    enrollments: "Enrollments"
}

