import { AttendeeModifyType, AttendeeType } from "./AttendeeTypes";
import { ClassUserType } from "./ClassUserTypes";

export interface StudentClassInfoType {
    student: ClassUserType,
    attendants: AttendeeModifyType[]
}
export interface ClassInfoType {
    students: StudentClassInfoType[]
}