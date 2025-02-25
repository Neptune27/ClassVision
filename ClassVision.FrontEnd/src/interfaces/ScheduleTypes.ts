import { CommonType } from "./CommonType";

export interface ScheduleType extends CommonType, ScheduleModifyType {
    id: string
}



export type ScheduleModifyType = {
    courseId: string,
    date: string,
    startTime: string,
    endTime: string,
}

