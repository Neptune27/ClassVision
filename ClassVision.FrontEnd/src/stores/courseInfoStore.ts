import { proxy } from 'valtio'
import { CourseInfoModifyType, CourseInfoType } from '../interfaces/CourseInfoType'

export const courseInfoDefault = (): CourseInfoModifyType => {
    return ({
        id: "",
        name: "",
    })
}

export const courseInfoStore = proxy<{ fetchTrigger: number, data: CourseInfoType[] }>({
    fetchTrigger: 0,
    data: []
})

export const courseInfoModifyStore = proxy<{ opened: boolean, isEdit: boolean, data: CourseInfoModifyType }>({
    opened: false,
    isEdit: false,
    data: courseInfoDefault()
})

export const courseInfoDeleteStore = proxy<{ opened: boolean, id: string }>({
    id: "",
    opened: false
})


export const courseInfoBatchDeleteStore = proxy<{ opened: boolean, ids: string[] }>({
    ids: [],
    opened: false
})
