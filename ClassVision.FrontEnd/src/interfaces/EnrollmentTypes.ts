import { CommonType, VisibleNameType } from "./CommonType";
import { StudentType } from "./StudentTypes";

export interface EnrollmentType extends CommonType, EnrollmentModifyType {
    student?: StudentType
}



export type EnrollmentModifyType = {
    studentId: string,
    courseId: string,
}


export const EnrollmentVisibleName: VisibleNameType<EnrollmentType> = {
    createdAt: "Created At",
    isActive: "Is Active",
    lastUpdated: "Last updated",
    studentId: "Student Id",
    student: "student",
    courseId: "Course Id"
}