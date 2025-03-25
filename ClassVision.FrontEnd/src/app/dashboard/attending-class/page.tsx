import DbHeader from "@/components/dashboard/DbHeader";
import { ClassScheduleTab } from "../../../components/attendingClass/ClassScheduleTab";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ClassCalendar } from "../../../components/infos/calendars/ClassCalendar";


export default function Page() {


    return (
        <>
            <DbHeader items={[{ name: "Dashboard" }, { name: "Attending Class" }]} />

            <Tabs defaultValue="schedule" className="w-full p-4">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="schedule">Schedules</TabsTrigger>
                    <TabsTrigger value="calendar">Calendar</TabsTrigger>
                </TabsList>
                <TabsContent value="calendar">
                    <ClassCalendar/>
                </TabsContent>
                <TabsContent value="schedule">
                    <ClassScheduleTab />
                </TabsContent>
            </Tabs>
        </>
    )
}
