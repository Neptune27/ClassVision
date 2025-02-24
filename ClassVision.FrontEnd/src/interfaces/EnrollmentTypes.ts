import { CommonType } from "./CommonType";

export interface EnrollmentType extends CommonType, EnrollmentModifyType {
}



export type EnrollmentModifyType = {
    id: string,
    enrollmentInfoId: string,
    teacherId: string,
    classroomId: string,
    attendantId: string,
    enrollments: string[],
    scheldules: string[],
    period: number,
}

