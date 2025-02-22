import { proxy } from 'valtio'
import { CourseInfoModifyType } from '../interfaces/CourseInfoType'

export const courseInfoDefault = (): CourseInfoModifyType => {
    return ({
        id: "",
        name: "",
    })
}

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
