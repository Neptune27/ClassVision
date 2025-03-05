import { AttendeeType } from "./AttendeeTypes";
import { CommonType, VisibleNameType } from "./CommonType";
import { CourseType } from "./CourseTypes";

export interface ScheduleType extends CommonType, ScheduleModifyType {
    course?: CourseType,
    attendants?: AttendeeType[]
}



export type ScheduleModifyType = {
    id: string,
    courseId: string,
    date: string,
    startTime: string,
    endTime: string,
    period: number
}

export const ScheduleVisibleName: VisibleNameType<ScheduleType> = {
    createdAt: "Created At",
    isActive: "Is Active",
    lastUpdated: "Last updated",
    course: "Course",
    attendants: "Attendees",
    id: "Id",
    courseId: "Course Id",
    date: "Date",
    startTime: "Start Time",
    endTime: "End Time",
    period: "Period",
}
