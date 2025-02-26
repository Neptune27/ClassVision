import { CommonType } from "./CommonType";

export interface EnrollmentType extends CommonType, EnrollmentModifyType {
}



export type EnrollmentModifyType = {
    studentId: string,
    courseId: string,
}

