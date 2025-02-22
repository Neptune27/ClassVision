import { CommonType, ExcludeCommonType } from "./CommonType"

export interface ClassroomType extends CommonType {
    roomId: string,
    capacity: number,
} 

export type ClassroomModifyType = Omit<ClassroomType, ExcludeCommonType>