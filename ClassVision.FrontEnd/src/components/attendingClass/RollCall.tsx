"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { ScheduleType } from "../../interfaces/ScheduleTypes"
import { authorizedFetch } from "../../utils/authorizedFetcher"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import svgStyle from "@/styles/svg.module.scss"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "../ui/resizable"
import { ScrollArea } from "../ui/scroll-area"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card"
import { ImageCard } from "./ImageCard"
import { TestImageCard } from "./TestImageCard"
import { RecognitionCard } from "./RecognitionCard"
import { rollcallStore } from "../../stores/rollcallStores"
import { ImageFaceExampleData } from "../../interfaces/ImageFaceType"
import { Separator } from "../ui/separator"
import { RollCallStudentTable } from "./RollCallStudentTable"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { Button } from "../ui/button"


const scheduleUrl = "/api/Schedule"
const attendeeUrl = "/api/Attendee"

const store = rollcallStore;

export function RollCall({ id }: {
    id: string
}) {
    const router = useRouter()

    const [schedule, setSchedule] = useState<ScheduleType>()


    useEffect(() => {
        const fetchSchedule = async () => {
            const resp = await authorizedFetch(`${scheduleUrl}/${id}`);
            const data = await resp.json()
            console.log(data)

            setSchedule(data)
        }

        fetchSchedule()
    }, [])

    useEffect(() => {
        const students = schedule?.course?.enrollments.map(e => e.student)
            .filter(s => s != undefined)
        if (!students) {
            return
        }

        store.userData = students
        store.attentee = schedule?.attendants ?? []

        store.data.splice(0, store.data.length)
        store.data.push({
            image: {
                height: 10,
                width: 10,
                url: "/api/Media/lop6.jpg"
            },
            faces: ImageFaceExampleData
        })

        console.log(store)
    }, [schedule])

    const handleCreateRollCall = async () => {
        const resp = await authorizedFetch(`/api/Attendee/bySchedule/${id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'text/plain;charset=UTF-8'
            },
        })
    }

    return (
        <div className={"md:p-10 h-full"}>
            <div className="container mx-auto ">
                <RecognitionCard />
            </div>

            <Separator className="mt-4 mb-4"/>

            <RollCallStudentTable >
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="default" className="ml-2">
                            Actions
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {/*<DropdownMenuItem onClick={handleCreate}>Create</DropdownMenuItem>*/}
                        {/*<DropdownMenuItem onClick={handleDelete}>Delete</DropdownMenuItem>*/}
                        <DropdownMenuItem onClick={handleCreateRollCall}>Create rollcall</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </RollCallStudentTable>
        </div>
    )
}