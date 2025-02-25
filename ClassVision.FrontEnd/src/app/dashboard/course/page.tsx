"use client"

import { useSnapshot } from "valtio"
import DbHeader from "../../../components/dashboard/DbHeader"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../../components/ui/dropdown-menu"
import { Button } from "../../../components/ui/button"
import { Row } from "@tanstack/react-table"
import { CourseDialog, CourseDeleteDialog, CourseBatchDeleteDialog } from "../../../components/courses/CourseDialog"
import { CourseTable } from "../../../components/courses/CourseTable"
import { CourseType } from "../../../interfaces/CourseTypes"
import { courseModifyStore, courseBatchDeleteStore, courseDefault } from "../../../stores/courseStores"
import { SimpleTimePicker } from "../../../components/ui/simple-time-picker"
import { DateTimePicker } from "../../../components/ui/datetime-picker"


export default function Page() {
    const modifyStore = courseModifyStore;
    const deleteStore = courseBatchDeleteStore;

    const modifySnap = useSnapshot(modifyStore)
    const deleteSnap = useSnapshot(deleteStore)

    const handleCreate = () => {
        modifyStore.data = courseDefault()

        modifyStore.isEdit = false
        modifyStore.opened = true
    }

    const handleDelete = () => {
        deleteStore.opened = true
    }


    const handleSetSelected = (rows: Row<CourseType>[]) => {
        deleteStore.ids = rows.map(row => row.original.id)
    }

    return (
        <>
            <DbHeader items={[{ name: "Dashboard" }, { name: "Course" }]} />
            <CourseTable setSelectedRows={handleSetSelected}>
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

            </CourseTable>

            <CourseDialog isEdit={modifySnap.isEdit} />
            <CourseDeleteDialog />
            <CourseBatchDeleteDialog />
        </>
    )
}

