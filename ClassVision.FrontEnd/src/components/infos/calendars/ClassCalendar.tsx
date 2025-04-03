"use client"

import { scheduleStore } from "../../../stores/scheduleStores";
import { useSnapshot } from "valtio";

import FullCalendar from '@fullcalendar/react'
import timeGridDay from '@fullcalendar/timegrid' // a plugin!
import dayGridPlugin from '@fullcalendar/daygrid' // a plugin!
import { useState, useEffect } from "react";
import { EventSourceInput } from "@fullcalendar/core/index.js";
import { DateTime } from "luxon"
import { authorizedFetch } from "../../../utils/authorizedFetcher";


const scheduleUrl = "/api/Schedule"
const rollCallUrl = "/dashboard/attending-class/rollcall"

export function ClassCalendar({
    filteredId,
    className
}: {
    filteredId?: string,
    className?: string
}) {
    const store = scheduleStore;
    const snap = useSnapshot(store)

    const [events, setEvents] = useState<EventSourceInput>([])


    const filterString = filteredId ?? ""
    const fetchSchedule = async () => {
        const resp = await authorizedFetch(`${scheduleUrl}/byUser`);
        const data = await resp.json()
        console.log(data)
        store.data = data
        //setSchedules(data)
    }

    useEffect(() => {
        if (store.data.length == 0) {
            fetchSchedule()
        }
    }, [])

    useEffect(() => {
        fetchSchedule()
    }, [snap.fetchTrigger])

    useEffect(() => {
        const newEvent: EventSourceInput = snap.data.filter(s => s.course.id.includes(filterString)).map(d => {
            return {
                id: d.id,
                start: DateTime.fromISO(`${d.date}T${d.startTime}Z`).toJSDate(),
                end: DateTime.fromISO(`${d.date}T${d.endTime}Z`).toJSDate(),
                url: `${rollCallUrl}/${d.id}`,
                title: `${d.course?.courseInfo.name}`
            }
        })
        console.log(newEvent)

        setEvents(newEvent)
    }, [snap.data])


    return (
        <div className={className}>
            <FullCalendar
                plugins={[dayGridPlugin, timeGridDay]}
                initialView="timeGridWeek"
                timeZone="UTC"
                slotLabelFormat={{
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: false
                }}
                eventTimeFormat={{
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: false
                }}
                headerToolbar={{
                    left: 'prev,next today',
                    center: 'title',
                    right: 'dayGridMonth,timeGridWeek,timeGridDay'
                }}
                height={512}

                events={events}
            />

        </div>
            )
}
