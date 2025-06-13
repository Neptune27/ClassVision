import { proxy, useSnapshot } from 'valtio'
import { ClassroomModifyType, ClassroomType } from '../interfaces/ClassroomType'

export const classroomDefault = (): ClassroomModifyType => {
    return ({
        capacity: 1,
        roomId: ""
    })
}

export const classroomStore = proxy<{ fetchTrigger: number, data: ClassroomType[] }>({
    fetchTrigger: 0,
    data: []
})

export const classroomModifyStore = proxy<{ opened: boolean, isEdit: boolean, data: ClassroomModifyType }>({
    opened: false,
    isEdit: false,
    data: classroomDefault()
})

export const classroomDeleteStore = proxy<{ opened: boolean, id: string }>({
    id: "",
    opened: false
})


export const classroomBatchDeleteStore = proxy<{ opened: boolean, ids: string[] }>({
    ids: [],
    opened: false
})