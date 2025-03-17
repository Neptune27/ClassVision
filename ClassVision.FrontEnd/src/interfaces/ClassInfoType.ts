import { AttendeeModifyType, AttendeeType } from "./AttendeeTypes";
import { StudentType } from "./StudentTypes";

export interface StudentClassInfoType {
    student: StudentType,
    attendants: AttendeeModifyType[]
}
export interface ClassInfoType {
    students: StudentClassInfoType[]
}