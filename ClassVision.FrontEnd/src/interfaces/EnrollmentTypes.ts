import { CommonType } from "./CommonType";
import { StudentType } from "./StudentTypes";

export interface EnrollmentType extends CommonType, EnrollmentModifyType {
    student?: StudentType
}



export type EnrollmentModifyType = {
    studentId: string,
    courseId: string,
}

