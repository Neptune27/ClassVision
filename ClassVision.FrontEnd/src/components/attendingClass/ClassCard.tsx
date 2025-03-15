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
const now = new Date()
type SBTType = {
    prev: ScheduleType[],
    curr: ScheduleType[],
    next: ScheduleType[]
}
export function ClassCard() {
    const make = [...Array(10).keys()]
    const [schedules, setSchedules] = useState<ScheduleType[]>([])
    const [schedulesByTime, setSBT] = useState<SBTType>({ curr: [], next: [], prev: [] })

    useEffect(() => {
        const fetchSchedule = async () => {
            const resp = await authorizedFetch(`${scheduleUrl}/byUser`);
            const data = await resp.json()
            console.log(data)

            setSchedules(data)
        }

        fetchSchedule()
    }, [])


    useEffect(() => {
        const scheduleByT: SBTType = {
            prev: [],
            curr: [],
            next: []
        }

        schedules.forEach(s => {
            const start = new Date(`${s.date}T${s.startTime}`)
            const end = new Date(`${s.date}T${s.endTime}`) 
            if (start < now && end > now) {
                return scheduleByT.curr.push(s)
            }

            if (start > now) {
                return scheduleByT.next.push(s)
            }

            return scheduleByT.prev.push(s)

        })

        //const available = schedules.filter(s => new Date(`${s.date}T${s.startTime}`) < now && new Date(`${s.date}T${s.endTime}`) > now)
        //console.log(available)

        setSBT(scheduleByT)
    }, [schedules])


    return (
        <>
            <h1 className="text-bold text-xl pb-4">Current:</h1>
            <div className="flex flex-wrap gap-4">
                {schedulesByTime.curr.map(s => <Card key={s.id} className="max-w-[350px]">
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
            <h1 className="text-bold text-xl pb-4 pt-4">Future:</h1>
            <div className="flex flex-wrap gap-4">
                {schedulesByTime.next.map(s => <Card key={s.id} className="max-w-[350px]">
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
            <h1 className="text-bold text-xl pb-4 pt-4">Previous:</h1>
            <div className="flex flex-wrap gap-4">
                {schedulesByTime.prev.map(s => <Card key={s.id} className="max-w-[350px]">
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

            {/*{schedules.map(s => <Card key={s.id} className="max-w-[350px]">*/}
            {/*    <CardHeader>*/}
            {/*        <CardTitle>{s.course.courseInfo.name}</CardTitle>*/}
            {/*        <CardDescription>*/}
            {/*            <h2 className="font-bold">{s.date}</h2>*/}
            {/*            <div>{s.startTime}-{s.endTime}</div>*/}
            {/*        </CardDescription>*/}
            {/*    </CardHeader>*/}
            {/*    <CardContent>*/}

            {/*    </CardContent>*/}
            {/*    <CardFooter >*/}
            {/*        <Link className="w-full" href={`./attending-class/rollcall/${s.id}`}>*/}
            {/*            <Button className="w-full">Go</Button>*/}
            {/*        </Link>*/}
            {/*    </CardFooter>*/}
            {/*</Card>)}*/}

        </>

    )
}