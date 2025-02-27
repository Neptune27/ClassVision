import { proxy } from 'valtio'
import { EnrollmentModifyType } from '../interfaces/EnrollmentTypes'
import { DateTime } from 'luxon'

export const enrollmentDefault = (): EnrollmentModifyType => {
    return ({
        courseId: "",
        studentId: ""
    })
}

export const enrollmentModifyStore = proxy<{ opened: boolean, isEdit: boolean, data: EnrollmentModifyType }>({
    opened: false,
    isEdit: false,
    data: enrollmentDefault()
})

export const enrollmentDeleteStore = proxy<{ opened: boolean, id: string }>({
    id: "",
    opened: false
})


export const enrollmentBatchDeleteStore = proxy<{ opened: boolean, ids: string[] }>({
    ids: [],
    opened: false
})
