import DbHeader from "@/components/dashboard/DbHeader";
import { ClassDetailsTable } from "../../../../../components/infos/classDetails/ClassDetailsTable";

import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import { ClassCard } from "@/components/attendingClass/ClassCard"
export default function Page({ params }: {
    params: {
        id: string
    }
}) {


    return (
        <>
            <DbHeader items={[{ name: "Dashboard" }, { name: "Info", url: "/dashboard/info" }, { name: "Class", url: "/dashboard/info/class" }, { name: params.id }]} />
            <Tabs defaultValue="info" className="w-full p-4">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="info">Info</TabsTrigger>
                    <TabsTrigger value="schedule">Schedules</TabsTrigger>
                </TabsList>
                <TabsContent value="info">
                    <ClassDetailsTable classId={params.id} >
                    </ClassDetailsTable>
                </TabsContent>
                <TabsContent value="schedule">
                    <ClassCard filteredId={params.id} /> 
                </TabsContent>
            </Tabs>

        </>
    )
}