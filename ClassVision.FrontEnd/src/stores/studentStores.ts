import { proxy } from 'valtio'
import { EGender, StudentModifyType } from '../interfaces/StudentTypes'
import { DateTime } from 'luxon'

export const studentDefault = (): StudentModifyType => {
    return ({
        id: "",
        address: "",
        birthday: DateTime.now().toISO(),
        enrollAt: DateTime.now().toISO(),
        firstName: "",
        lastName: "",
        gender: EGender.OTHER,
        media: "",
        phoneNumber: ""
    })
}

export const studentModifyStore = proxy<{ opened: boolean, isEdit: boolean, data: StudentModifyType }>({
    opened: false,
    isEdit: false,
    data: studentDefault()
})

export const studentDeleteStore = proxy<{ opened: boolean, id: string }>({
    id: "",
    opened: false
})


export const studentBatchDeleteStore = proxy<{ opened: boolean, ids: string[] }>({
    ids: [],
    opened: false
})
