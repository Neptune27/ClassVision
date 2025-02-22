"use client"

import { useSnapshot } from "valtio"
import DbHeader from "../../../components/dashboard/DbHeader"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../../components/ui/dropdown-menu"
import { Button } from "../../../components/ui/button"
import { Row } from "@tanstack/react-table"
import { courseInfoBatchDeleteStore, courseInfoDefault, courseInfoModifyStore } from "../../../stores/courseInfoStore"
import { CourseInfoDialog, CourseInfoDeleteDialog, CourseInfoBatchDeleteDialog } from "../../../components/courseInfos/CourseInfoDialog"
import { CourseInfoType } from "../../../interfaces/CourseInfoType"
import { CourseInfoTable } from "../../../components/courseInfos/CourseInfoTable"


const ClassroomPage = () => {
    const modifyStore = courseInfoModifyStore;
    const deleteStore = courseInfoBatchDeleteStore;

    const modifySnap = useSnapshot(modifyStore)
    const deleteSnap = useSnapshot(deleteStore)

    const handleCreate = () => {
        modifyStore.data = courseInfoDefault()

        modifyStore.isEdit = false
        modifyStore.opened = true
    }

    const handleDelete = () => {
        deleteStore.opened = true
    }


    const handleSetSelected = (rows: Row<CourseInfoType>[]) => {
        deleteStore.ids = rows.map(row => row.original.id)
    }

    return (
        <>
            <DbHeader items={[{ name: "Dashboard" }, { name: "Course Info" }]} />
            <CourseInfoTable setSelectedRows={handleSetSelected}>
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

            </CourseInfoTable>
            <CourseInfoDialog isEdit={modifySnap.isEdit} />
            <CourseInfoDeleteDialog />
            <CourseInfoBatchDeleteDialog />
        </>
    )
}

export default ClassroomPage