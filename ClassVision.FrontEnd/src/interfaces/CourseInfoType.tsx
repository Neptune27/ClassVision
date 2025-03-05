import { CommonType, ExcludeCommonType, VisibleNameType } from "./CommonType";

export interface CourseInfoType extends CommonType, CourseInfoModifyType {
}

export type CourseInfoModifyType = {
    id: string,
    name: string
}


export const CourseInfoVisibleName: VisibleNameType<CourseInfoType> = {
    createdAt: "Created At",
    isActive: "Is Active",
    lastUpdated: "Last updated",
    id: "Id",
    name: "Name"
}