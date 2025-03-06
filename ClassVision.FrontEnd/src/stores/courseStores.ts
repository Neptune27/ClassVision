import { proxy } from 'valtio'
import { CourseModifyType, CourseType } from '../interfaces/CourseTypes'

export const courseDefault = (): CourseModifyType => {
    return ({
        id: "",
        teacherId: "",
        classroomId: "",
        courseInfoId: "",
        period: 1,
        attendantId: [],
        schedules: [],
        studentIds: [],
    })
}

export const courseStore = proxy<{ fetchTrigger: boolean, data: CourseType[] }>({
    fetchTrigger: false,
    data: []
})

export const courseModifyStore = proxy<{ opened: boolean, isEdit: boolean, data: CourseModifyType }>({
    opened: false,
    isEdit: false,
    data: courseDefault()
})

export const courseDeleteStore = proxy<{ opened: boolean, id: string }>({
    id: "",
    opened: false
})


export const courseBatchDeleteStore = proxy<{ opened: boolean, ids: string[] }>({
    ids: [],
    opened: false
})
