import { CommonType, ExcludeCommonType } from "./CommonType";

export const enum EAttendantStatus {
    PRESENT = 0,
    ABSENT = 1,
    LATE = 2,
    EXCUSED = 3,
    OTHER = 4
}


export interface AttendeeType extends CommonType, AttendeeModifyType {

}



export type AttendeeModifyType = {
    id: string,
    studentId: string,
    courseId: string,
    scheduleId: string,
    status: EAttendantStatus,
}

