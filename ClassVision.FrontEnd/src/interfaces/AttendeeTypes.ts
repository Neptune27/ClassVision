import { CommonType, ExcludeCommonType } from "./CommonType";
import { EnrollmentType } from "./EnrollmentTypes";

export const enum EAttendantStatus {
    PRESENT = 0,
    ABSENT = 1,
    LATE = 2,
    EXCUSED = 3,
    OTHER = 4
}


export interface AttendeeType extends CommonType, AttendeeModifyType {
    enrollment?: EnrollmentType
}



export type AttendeeModifyType = {
    id: string,
    studentId: string,
    courseId: string,
    scheduleId: string,
    status: EAttendantStatus,
}

