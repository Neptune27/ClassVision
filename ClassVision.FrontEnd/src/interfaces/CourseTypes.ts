import { ClassroomType } from "./ClassroomType";
import { CommonType } from "./CommonType";
import { CourseInfoType } from "./CourseInfoType";
import { EnrollmentType } from "./EnrollmentTypes";
import { ScheduleModifyType, ScheduleType } from "./ScheduleTypes";
import { TeacherType } from "./TeacherTypes";

export interface CourseType extends CommonType {
    id: string,
    courseInfo: CourseInfoType,
    teacher: TeacherType,
    classroom: ClassroomType,
    attendantId: string[],
    attendants: any[],
    schedules: ScheduleModifyType[],
    enrollments: EnrollmentType[],
    period: number,
}


export type CourseModifyType = {
    id: string,
    courseInfoId: string,
    teacherId: string,
    classroomId: string,
    attendantId: string[],
    studentIds: string[],
    schedules: ScheduleModifyType[],
    period: number,
}

