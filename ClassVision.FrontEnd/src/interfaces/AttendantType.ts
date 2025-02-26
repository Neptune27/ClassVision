import { CommonType, ExcludeCommonType } from "./CommonType";

export interface AttendantType extends CommonType, AttendantModifyType {
}

export type AttendantModifyType = {
    id: string,
    name: string
}

