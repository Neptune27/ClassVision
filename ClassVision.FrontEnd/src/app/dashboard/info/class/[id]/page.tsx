import DbHeader from "@/components/dashboard/DbHeader";
import { ClassDetailsTable } from "@/components/infos/classDetails/ClassDetailsTable";
import { ClassCalendar } from "@/components/infos/calendars/ClassCalendar";

import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import { ClassScheduleTab } from "@/components/attendingClass/ClassScheduleTab"


export default async function Page({ params }: {
    params: Promise<{
        id: string
    }>
}) {

    const { id } = await params

    return (
        <>
            <DbHeader items={[{ name: "Dashboard" }, { name: "Info", url: "/dashboard/info" }, { name: "Class", url: "/dashboard/info/class" }, { name: id }]} />
            <Tabs defaultValue="info" className="w-full p-4">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="info">Info</TabsTrigger>
                    <TabsTrigger value="calendar">Calendar</TabsTrigger>
                    <TabsTrigger value="schedule">Rollcall</TabsTrigger>
                </TabsList>
                <TabsContent value="info">
                    <ClassDetailsTable classId={id} >
                       
                    </ClassDetailsTable>
                </TabsContent>
                <TabsContent value="calendar">
                    <ClassCalendar filteredId={id} initialView={"dayGridMonth"} className="mx-auto w-[812px]" />
                </TabsContent>
                <TabsContent value="schedule">
                    <ClassScheduleTab filteredId={id} /> 
                </TabsContent>
            </Tabs>

        </>
    )
}