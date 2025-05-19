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
import { toast } from "../../../hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../ui/card";
import { AlertCircle, Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "../../ui/alert";


const scheduleUrl = "/api/Schedule"
const classUrl = "/dashboard/info/class/"

export function ClassCalendar({
    filteredId,
    className,
    initialView
}: {
    initialView?: string,
    filteredId?: string,
    className?: string
}) {
    const store = scheduleStore;
    const snap = useSnapshot(store)

    const [events, setEvents] = useState<EventSourceInput>([])
    const [isTeacher, setIsTeacher] = useState(false)
    const [isLoading, setLoading] = useState<boolean>(true)

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

        const fetchIsTeacher = async () => {
            const resp = await authorizedFetch(`/api/Course/IsTeacher/${filteredId}`)
            if (!resp.ok) {
                toast({
                    value: "Error fetching is teacher",
                    variant: "destructive"
                })
            }

            setIsTeacher(await resp.json())
            setLoading(false)
        }

        fetchIsTeacher()
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
                url: `${classUrl}/${d.course?.id}/${d.id}`,
                title: `${d.course?.courseName}`
            }
        })
        console.log(newEvent)

        setEvents(newEvent)
    }, [snap.data])




    if (isLoading) {
        return (
                <Card className="w-full mx-auto max-w-md flex items-center justify-center p-8">
                    <div className="flex flex-col items-center gap-2">
                        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
                        <p>Loading...</p>
                    </div>
                </Card>
        )
    }

    if (!isTeacher) {
        return (
            <Card className="w-full mx-auto max-w-md justify-center">
                <CardHeader>
                    <CardTitle className="text-xl">Calendar</CardTitle>
                    <CardDescription>Calendar for class</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col items-center gap-2">
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Not Available</AlertTitle>
                            <AlertDescription>You're not authorized to see this content.</AlertDescription>
                        </Alert>
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className={className}>
            <CardHeader>
                <CardTitle className="text-xl">Calendar</CardTitle>
                <CardDescription>Calendar for class</CardDescription>
            </CardHeader>

            <CardContent>
                <FullCalendar
                    plugins={[dayGridPlugin, timeGridDay]}
                    initialView={initialView ?? "timeGridWeek"}
                    timeZone="GMT+7"
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
            </CardContent>


        </Card>
            )
}
