import { proxy } from "valtio";
import { StudentClassInfoType } from "../interfaces/ClassInfoType";

export const classInfoStore = proxy<{ fetchTrigger: number, data: StudentClassInfoType[] }>({
    fetchTrigger: 0,
    data: []
})