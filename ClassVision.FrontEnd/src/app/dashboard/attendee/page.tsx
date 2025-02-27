"use client"

import { useSnapshot } from "valtio"
import DbHeader from "../../../components/dashboard/DbHeader"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../../components/ui/dropdown-menu"
import { Button } from "../../../components/ui/button"
import { Row } from "@tanstack/react-table"
import { AttendeeDialog, AttendeeDeleteDialog, AttendeeBatchDeleteDialog } from "../../../components/attendees/AttendeeDialog"
import { AttendeeTable } from "../../../components/attendees/AttendeeTable"
import { AttendeeType } from "../../../interfaces/AttendeeTypes"
import { attendeeModifyStore, attendeeBatchDeleteStore, attendeeDefault } from "../../../stores/attendeeStores"
import { SimpleTimePicker } from "../../../components/ui/simple-time-picker"
import { DateTimePicker } from "../../../components/ui/datetime-picker"


export default function Page() {
    const modifyStore = attendeeModifyStore;
    const deleteStore = attendeeBatchDeleteStore;

    const modifySnap = useSnapshot(modifyStore)
    const deleteSnap = useSnapshot(deleteStore)

    const handleCreate = () => {
        modifyStore.data = attendeeDefault()

        modifyStore.isEdit = false
        modifyStore.opened = true
    }

    const handleDelete = () => {
        deleteStore.opened = true
    }


    const handleSetSelected = (rows: Row<AttendeeType>[]) => {
        deleteStore.ids = rows.map(row => `${row.original.courseId}|${row.original.studentId}`)
    }

    return (
        <>
            <DbHeader items={[{ name: "Dashboard" }, { name: "Attendee" }]} />
            <AttendeeTable setSelectedRows={handleSetSelected}>
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

            </AttendeeTable>

            <AttendeeDialog isEdit={modifySnap.isEdit} />
            <AttendeeDeleteDialog />
            <AttendeeBatchDeleteDialog />
        </>
    )
}

