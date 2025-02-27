import { CommonType } from "./CommonType";
import { CourseType } from "./CourseTypes";

export interface ScheduleType extends CommonType, ScheduleModifyType {
    course: CourseType
}



export type ScheduleModifyType = {
    id: string,
    courseId: string,
    date: string,
    startTime: string,
    endTime: string,
    period: number
}

