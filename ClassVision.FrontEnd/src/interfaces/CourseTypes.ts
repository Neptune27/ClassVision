import { CommonType } from "./CommonType";
import { ScheduleType } from "./ScheduleTypes";

export interface CourseType extends CommonType, CourseModifyType {
}



export type CourseModifyType = {
    id: string,
    courseInfoId: string,
    teacherId: string,
    classroomId: string,
    attendantId: string[],
    studentIds: string[],
    scheldules: ScheduleType[],
    period: number,
}

