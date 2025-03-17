import { proxy } from "valtio";
import { StudentClassInfoType } from "../interfaces/ClassInfoType";

export const classInfoStore = proxy<{ fetchTrigger: boolean, data: StudentClassInfoType[] }>({
    fetchTrigger: false,
    data: []
})