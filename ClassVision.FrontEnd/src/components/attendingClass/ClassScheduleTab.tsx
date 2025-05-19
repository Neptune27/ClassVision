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
import { ScheduleDialog } from "../schedules/ScheduleDialog"
import { useSnapshot } from "valtio"
import { scheduleModifyStore, scheduleDefault, scheduleStore } from "../../stores/scheduleStores"
import { ScheduleInfoCard } from "./ScheduleInfoCard"
import { Alert, AlertDescription, AlertTitle } from "../ui/alert"
import { Loader2, AlertCircle } from "lucide-react"
import { toast } from "../../hooks/use-toast"

const scheduleUrl = "/api/Schedule"
const now = new Date()
type SBTType = {
    prev: ScheduleType[],
    curr: ScheduleType[],
    next: ScheduleType[]
}
export function ClassScheduleTab({ filteredId}: {
    filteredId?: string
}) {


    const store = scheduleStore;
    const snap = useSnapshot(store)
    const modifyStore = scheduleModifyStore;
    const modifySnap = useSnapshot(modifyStore)
    const handleCreate = () => {
        modifyStore.data = scheduleDefault()

        if (filteredId) {
            modifyStore.data.courseId = filteredId
        }

        modifyStore.isEdit = false
        modifyStore.opened = true
    }

    //const [schedules, setSchedules] = useState<ScheduleType[]>([])
    const [schedulesByTime, setSBT] = useState<SBTType>({ curr: [], next: [], prev: [] })
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

        if (snap.data.length == 0)
            fetchSchedule()



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
        const scheduleByT: SBTType = {
            prev: [],
            curr: [],
            next: []
        }

        snap.data.filter(s => s.course.id.includes(filterString)).forEach(s => {
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
                    <CardTitle className="text-xl">All Rollcalls</CardTitle>
                    <CardDescription>Rollcalls for class</CardDescription>
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
        <>
            <ScheduleDialog isEdit={modifySnap.isEdit} />
            <div className="flex justify-between">
                <h1 className="text-bold text-xl pb-4">Current:</h1>
                <Button onClick={handleCreate}>Create new Rollcall</Button>
            </div>
            <div className="flex flex-wrap gap-4">
                {schedulesByTime.curr.map(s => <ScheduleInfoCard key={s.id} schedule={s} />)}
            </div>
            <h1 className="text-bold text-xl pb-4 pt-4">Future:</h1>
            <div className="flex flex-wrap gap-4">
                {schedulesByTime.next.map(s => <ScheduleInfoCard key={s.id} schedule={s} />)}
            </div>
            <h1 className="text-bold text-xl pb-4 pt-4">Previous:</h1>
            <div className="flex flex-wrap gap-4">
                {schedulesByTime.prev.map(s => <ScheduleInfoCard key={s.id} schedule={s} />)}
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