import { proxy } from 'valtio'
import { EGender, TeacherModifyType } from '../interfaces/TeacherTypes'
import { DateTime } from 'luxon'

export const teacherDefault = (): TeacherModifyType => {
    return ({
        id: "",
        userId: "",
        address: "",
        birthday: DateTime.now().toISO(),
        hireDate: DateTime.now().toISO(),
        firstName: "",
        lastName: "",
        gender: EGender.OTHER,
        phoneNumber: ""
    })
}

export const teacherModifyStore = proxy<{ opened: boolean, isEdit: boolean, data: TeacherModifyType }>({
    opened: false,
    isEdit: false,
    data: teacherDefault()
})

export const teacherDeleteStore = proxy<{ opened: boolean, id: string }>({
    id: "",
    opened: false
})


export const teacherBatchDeleteStore = proxy<{ opened: boolean, ids: string[] }>({
    ids: [],
    opened: false
})
