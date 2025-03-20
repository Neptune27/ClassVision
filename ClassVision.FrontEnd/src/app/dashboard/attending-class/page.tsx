"use client"

import DbHeader from "@/components/dashboard/DbHeader";
import { ClassCard } from "../../../components/attendingClass/ClassCard";
import { Button } from "@/components/ui/button"; 
import { scheduleModifyStore, scheduleDefault } from "../../../stores/scheduleStores";
import { ScheduleDialog } from "../../../components/schedules/ScheduleDialog";
import { useSnapshot } from "valtio";

export default function Page() {
    const modifyStore = scheduleModifyStore;
    const modifySnap = useSnapshot(modifyStore)
    const handleCreate = () => {
        modifyStore.data = scheduleDefault()

        modifyStore.isEdit = false
        modifyStore.opened = true
    }

    return (
        <>
            <DbHeader items={[{ name: "Dashboard" }, { name: "Attending Class" }]} />
            <div className="container mx-auto p-10">
                <div className="flex gap-2">
                    <h1 className="text-bold text-xl pb-4">Classes:</h1>
                    <Button onClick={handleCreate}>Create new Schedule</Button>
                </div>
                <ClassCard />
            </div>
            <ScheduleDialog isEdit={modifySnap.isEdit} />
        </>
    )
}
