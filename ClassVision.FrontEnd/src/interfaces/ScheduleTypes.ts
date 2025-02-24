import { CommonType } from "./CommonType";

export interface ScheduleType extends CommonType, ScheduleModifyType {

}



export type ScheduleModifyType = {
    id: string,
    courseId: string,
    date: string,
    startTime: string,
    endTime: string,
}

