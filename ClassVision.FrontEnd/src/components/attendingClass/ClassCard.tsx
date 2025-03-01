"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card"
import { authorizedFetch } from "../../utils/authorizedFetcher"
import { useEffect, useState } from "react"
import { Label } from "../ui/label"
import { Input } from "../ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Button } from "../ui/button"
import { ScheduleType } from "../../interfaces/ScheduleTypes"


const scheduleUrl = "/api/Schedule"

export function ClassCard() {
    const make = [...Array(10).keys()]
    const [schedules, setSchedules] = useState<ScheduleType[]>([])

    useEffect(() => {
        const fetchSchedule = async () => {
            const resp = await authorizedFetch(`${scheduleUrl}/byUser`);
            const data = await resp.json()
            console.log(data)

            setSchedules(data)
        }

        fetchSchedule()
    }, [])

    return (
        <div className="flex flex-wrap gap-4">
            {schedules.map(s => <Card key={s.id} className="max-w-[350px]">
                <CardHeader>
                    <CardTitle>{s.course.courseInfo.name}</CardTitle>
                    <CardDescription>
                        <h2 className="font-bold">{s.date}</h2>
                        <div>{s.startTime}-{s.endTime}</div>
                    </CardDescription>
                </CardHeader>
                <CardContent>

                </CardContent>
                <CardFooter >
                    <Link className="w-full" href={`./attending-class/rollcall/${s.id}`}>
                        <Button className="w-full">Go</Button>
                    </Link>
                </CardFooter>
            </Card>)}

        </div>

    )
}