"use client"

import { useSnapshot } from "valtio"
import DbHeader from "../../../components/dashboard/DbHeader"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../../components/ui/dropdown-menu"
import { Button } from "../../../components/ui/button"
import { Row } from "@tanstack/react-table"
import { ScheduleDialog, ScheduleDeleteDialog, ScheduleBatchDeleteDialog } from "../../../components/schedules/ScheduleDialog"
import { ScheduleTable } from "../../../components/schedules/ScheduleTable"
import { ScheduleType } from "../../../interfaces/ScheduleTypes"
import { scheduleModifyStore, scheduleBatchDeleteStore, scheduleDefault } from "../../../stores/scheduleStores"
import { SimpleTimePicker } from "../../../components/ui/simple-time-picker"
import { DateTimePicker } from "../../../components/ui/datetime-picker"


export default function Page() {
    const modifyStore = scheduleModifyStore;
    const deleteStore = scheduleBatchDeleteStore;

    const modifySnap = useSnapshot(modifyStore)
    const deleteSnap = useSnapshot(deleteStore)

    const handleCreate = () => {
        modifyStore.data = scheduleDefault()

        modifyStore.isEdit = false
        modifyStore.opened = true
    }

    const handleDelete = () => {
        deleteStore.opened = true
    }


    const handleSetSelected = (rows: Row<ScheduleType>[]) => {
        deleteStore.ids = rows.map(row => row.original.id)
    }

    return (
        <>
            <DbHeader items={[{ name: "Dashboard" }, { name: "Schedule" }]} />
            <ScheduleTable setSelectedRows={handleSetSelected}>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="default" className="ml-2">
                            Actions
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={handleCreate}>Create</DropdownMenuItem>
                        <DropdownMenuItem onClick={handleDelete}>Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

            </ScheduleTable>

            <ScheduleDialog isEdit={modifySnap.isEdit} />
            <ScheduleDeleteDialog />
            <ScheduleBatchDeleteDialog />
        </>
    )
}

