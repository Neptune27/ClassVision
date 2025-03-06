import { proxy } from 'valtio'
import { ScheduleModifyType, ScheduleType } from '../interfaces/ScheduleTypes'
import { DateTime } from 'luxon'

export const scheduleDefault = (): ScheduleModifyType => {
    return ({
        id: "",
        courseId: "",
        date: DateTime.now().toISO(),
        endTime: "07:00:00",
        startTime: "07:00:00",
        period: 1
    })
}

export const scheduleStore = proxy<{ fetchTrigger: boolean, data: ScheduleType[] }>({
    fetchTrigger: false,
    data: []
})

export const scheduleModifyStore = proxy<{ opened: boolean, isEdit: boolean, data: ScheduleModifyType }>({
    opened: false,
    isEdit: false,
    data: scheduleDefault()
})

export const scheduleDeleteStore = proxy<{ opened: boolean, id: string }>({
    id: "",
    opened: false
})


export const scheduleBatchDeleteStore = proxy<{ opened: boolean, ids: string[] }>({
    ids: [],
    opened: false
})
