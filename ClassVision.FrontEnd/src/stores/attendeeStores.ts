import { proxy } from 'valtio'
import { AttendeeModifyType, AttendeeType, EAttendantStatus } from '../interfaces/AttendeeTypes'

export const attendeeDefault = (): AttendeeModifyType => {
    return ({
        id: "",
        scheduleId: "",
        courseId: "",
        studentId: "",
        status: EAttendantStatus.PRESENT
    })
}

export const attendeeStore = proxy<{ fetchTrigger: boolean, data: AttendeeType[] }>({
    fetchTrigger: false,
    data: []
})

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
