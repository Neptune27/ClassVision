import { CommonType, ExcludeCommonType, VisibleNameType } from "./CommonType"

export interface ClassroomType extends CommonType {
    roomId: string,
    capacity: number,
} 

export type ClassroomModifyType = Omit<ClassroomType, ExcludeCommonType>


export const ClassroomVisibleName: VisibleNameType<ClassroomType> = {
    createdAt: "Created At",
    isActive: "Is Active",
    lastUpdated: "Last updated",
    capacity: "Capacity",
    roomId: "Room Id"
}