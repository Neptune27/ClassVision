import { proxy } from 'valtio'
import { AttendeeModifyType, EAttendantStatus } from '../interfaces/AttendeeTypes'
import { DateTime } from 'luxon'

export const attendeeDefault = (): AttendeeModifyType => {
    return ({
        id: "",
        scheduleId: "",
        courseId: "",
        studentId: "",
        status: EAttendantStatus.PRESENT
    })
}

export const attendeeModifyStore = proxy<{ opened: boolean, isEdit: boolean, data: AttendeeModifyType }>({
    opened: false,
    isEdit: false,
    data: attendeeDefault()
})

export const attendeeDeleteStore = proxy<{ opened: boolean, id: string }>({
    id: "",
    opened: false
})


export const attendeeBatchDeleteStore = proxy<{ opened: boolean, ids: string[] }>({
    ids: [],
    opened: false
})
