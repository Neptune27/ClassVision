import { CommonType, ExcludeCommonType, VisibleNameType } from "./CommonType";
import { EnrollmentType } from "./EnrollmentTypes";


export const enum EAttendantStatus {
    PRESENT = 0,
    ABSENT = 1,
    LATE = 2,
    EXCUSED = 3,
    OTHER = 4,
    AUTOMATED = 5,
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
        case EAttendantStatus.AUTOMATED:
            return "Automated"
    }
}

export const StringToEAttendantStatus = (value: string) => {
    switch (value) {
        case "Present":
            return EAttendantStatus.PRESENT;
        case "Automated":
            return EAttendantStatus.AUTOMATED;
        case "Absent":
            return EAttendantStatus.ABSENT
        case "Late":
            return EAttendantStatus.LATE
        case "Excused":
            return EAttendantStatus.EXCUSED
        case "Other":
            return EAttendantStatus.OTHER
        default:
            throw new Error("Not supported value")
    }
}


export interface AttendeeType extends CommonType, AttendeeModifyType {
    enrollment?: EnrollmentType
}


export const AttendeeVisibleName: VisibleNameType<AttendeeType> = {
    id: "Id",
    studentId: "Student Id",
    courseId: "Course Id",
    scheduleId: "Schedule Id",
    createdAt: "Created At",
    enrollment: "Enrollment",
    isActive: "Is Active",
    lastUpdated: "Last updated",
    status: "Status",
    enrollment_student_lastName: "Lastname",
    enrollment_student_firstName: "Firstname",
}



export type AttendeeModifyType = {
    id: string,
    studentId: string,
    courseId: string,
    scheduleId: string,
    status: EAttendantStatus,
}

