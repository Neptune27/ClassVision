import { CommonType, ExcludeCommonType } from "./CommonType";
import { EnrollmentType } from "./EnrollmentTypes";


export const enum EAttendantStatus {
    PRESENT = 0,
    ABSENT = 1,
    LATE = 2,
    EXCUSED = 3,
    OTHER = 4
}

export const EAttendantStatusToString = (value: EAttendantStatus) => {
    switch (value) {
        case EAttendantStatus.PRESENT:
            return "Present";
        case EAttendantStatus.ABSENT:
            return "Absent"
        case EAttendantStatus.LATE:
            return "Late"
        case EAttendantStatus.EXCUSED:
            return "Excused"
        case EAttendantStatus.OTHER:
            return "Other"
    }
}

export const StringToEAttendantStatus = (value: string) => {
    switch (value) {
        case "Present":
            return EAttendantStatus.PRESENT;
        case "Absent":
            return EAttendantStatus.ABSENT
        case "Late":
            return EAttendantStatus.LATE
        case "Excused":
            return EAttendantStatus.EXCUSED
        case "Other":
            return EAttendantStatus.OTHER
        default:
            throw new Error("Value not support")
    }
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

