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

const scheduleUrl = "/api/Schedule"

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

    return (
        <div className={"p-10 h-full"}>
            <div className="container mx-auto">
                <TestImageCard />
            </div>

        </div>
    )
}