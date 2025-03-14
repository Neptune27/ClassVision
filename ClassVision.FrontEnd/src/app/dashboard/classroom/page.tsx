"use client"

import { useSnapshot } from "valtio"
import ClassroomTable from "../../../components/classroom/ClassroomTable"
import DbHeader from "../../../components/dashboard/DbHeader"
import { classroomBatchDeleteStore, classroomDefault, classroomModifyStore } from "../../../stores/classroomStores"
import { ClassroomBatchDeleteDialog, ClassroomDeleteDialog, ClassroomDialog } from "../../../components/classroom/ClassroomDialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../../components/ui/dropdown-menu"
import { Button } from "../../../components/ui/button"
import { useState } from "react"
import { ClassroomType } from "../../../interfaces/ClassroomType"
import { Row } from "@tanstack/react-table"

const modifyStore = classroomModifyStore
const deleteBatchStore = classroomBatchDeleteStore

const ClassroomPage = () => {
    const modifySnap = useSnapshot(modifyStore)
    const deleteSnap = useSnapshot(deleteBatchStore)

    const handleCreate = () => {
        modifyStore.data = classroomDefault()

        modifyStore.isEdit = false
        modifyStore.opened = true
    }

    const handleDelete = () => {
        deleteBatchStore.opened = true
    }


    const handleSetSelected = (rows: Row<ClassroomType>[]) => {
        deleteBatchStore.ids = rows.map(row => row.original.roomId)
    }

    return (
        <>
            <DbHeader items={[{ name: "Dashboard" }, { name: "Classroom" }]} />
            <ClassroomTable setSelectedRows={handleSetSelected}>
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

            </ClassroomTable>
            <ClassroomDialog isEdit={modifySnap.isEdit} />
            <ClassroomDeleteDialog />
            <ClassroomBatchDeleteDialog />
        </>
    )
}

export default ClassroomPage