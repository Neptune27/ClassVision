import { proxy } from 'valtio'
import { ScheduleModifyType, ScheduleType } from '../interfaces/ScheduleTypes'
import { DateTime } from 'luxon'

export const scheduleDefault = (): ScheduleModifyType => {
    const now = DateTime.now()
    const currentTime = now.set({
        millisecond: 0,
        second: 0
    })
    const endTime = currentTime.set({
        minute: currentTime.minute + 45
    })
    const data = {
        id: "",
        courseId: "",
        date: now.toISO(),
        endTime: endTime.toISOTime(),
        startTime: currentTime.toISOTime(),
        period: 1
    }
    console.log(data)
    return data
}

export const scheduleStore = proxy<{ fetchTrigger: number, data: ScheduleType[] }>({
    fetchTrigger: 0,
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
