import { CommonType, ExcludeCommonType } from "./CommonType";

export interface CourseInfoType extends CommonType, CourseInfoModifyType {
}

export type CourseInfoModifyType = {
    id: string,
    name: string
}

