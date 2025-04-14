import { ClassroomType } from "./ClassroomType";
import { CommonType, VisibleNameType } from "./CommonType";
import { CourseInfoType } from "./CourseInfoType";
import { EnrollmentType } from "./EnrollmentTypes";
import { ScheduleModifyType, ScheduleType } from "./ScheduleTypes";
import { TeacherType } from "./TeacherTypes";

export interface CourseType extends CommonType {
    id: string,
    courseName: string,
    teacher: TeacherType,
    classroom: ClassroomType,
    attendantId: string[],
    attendants: any[],
    schedules: ScheduleModifyType[],
    enrollments: EnrollmentType[],
    period: number,
}

export const CourseVisibleName: VisibleNameType<CourseType> = {
    createdAt: "Created At",
    isActive: "Is Active",
    lastUpdated: "Last updated",
    id: "Id",
    courseName: "Course Name",
    teacher: "Teacher",
    classroom: "Classroom",
    attendantId: "Attendant Ids",
    attendants: "Attendants",
    schedules: "Schedules",
    enrollments: "Enrollments",
    period: "Period"
}


export type CourseModifyType = {
    id: string,
    courseName: string,
    teacherId: string,
    classroomId: string,
    attendantId: string[],
    studentIds: string[],
    schedules: ScheduleModifyType[],
    period: number,
}

