"use client"

import { useSnapshot } from "valtio"
import DbHeader from "../../../components/dashboard/DbHeader"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../../components/ui/dropdown-menu"
import { Button } from "../../../components/ui/button"
import { Row } from "@tanstack/react-table"
import { EnrollmentDialog, EnrollmentDeleteDialog, EnrollmentBatchDeleteDialog } from "../../../components/enrollments/EnrollmentDialog"
import { EnrollmentTable } from "../../../components/enrollments/EnrollmentTable"
import { EnrollmentType } from "../../../interfaces/EnrollmentTypes"
import { enrollmentModifyStore, enrollmentBatchDeleteStore, enrollmentDefault } from "../../../stores/enrollmentStores"
import { SimpleTimePicker } from "../../../components/ui/simple-time-picker"
import { DateTimePicker } from "../../../components/ui/datetime-picker"


export default function Page() {
    const modifyStore = enrollmentModifyStore;
    const deleteStore = enrollmentBatchDeleteStore;

    const modifySnap = useSnapshot(modifyStore)
    const deleteSnap = useSnapshot(deleteStore)

    const handleCreate = () => {
        modifyStore.data = enrollmentDefault()

        modifyStore.isEdit = false
        modifyStore.opened = true
    }

    const handleDelete = () => {
        deleteStore.opened = true
    }


    const handleSetSelected = (rows: Row<EnrollmentType>[]) => {
        deleteStore.ids = rows.map(row => `${row.original.courseId}|${row.original.studentId}`)
    }

    return (
        <>
            <DbHeader items={[{ name: "Dashboard" }, { name: "Enrollment" }]} />
            <EnrollmentTable setSelectedRows={handleSetSelected}>
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

            </EnrollmentTable>

            <EnrollmentDialog isEdit={modifySnap.isEdit} />
            <EnrollmentDeleteDialog />
            <EnrollmentBatchDeleteDialog />
        </>
    )
}

