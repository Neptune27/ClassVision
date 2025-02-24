"use client"

import { useSnapshot } from "valtio"
import DbHeader from "../../../components/dashboard/DbHeader"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../../components/ui/dropdown-menu"
import { Button } from "../../../components/ui/button"
import { Row } from "@tanstack/react-table"
import { StudentDialog, StudentDeleteDialog, StudentBatchDeleteDialog } from "../../../components/students/StudentDialog"
import { StudentTable } from "../../../components/students/StudentTable"
import { StudentType } from "../../../interfaces/StudentTypes"
import { studentModifyStore, studentBatchDeleteStore, studentDefault } from "../../../stores/studentStores"


export default function Page() {
    const modifyStore = studentModifyStore;
    const deleteStore = studentBatchDeleteStore;

    const modifySnap = useSnapshot(modifyStore)
    const deleteSnap = useSnapshot(deleteStore)

    const handleCreate = () => {
        modifyStore.data = studentDefault()

        modifyStore.isEdit = false
        modifyStore.opened = true
    }

    const handleDelete = () => {
        deleteStore.opened = true
    }


    const handleSetSelected = (rows: Row<StudentType>[]) => {
        deleteStore.ids = rows.map(row => row.original.id)
    }

    return (
        <>
            <DbHeader items={[{ name: "Dashboard" }, { name: "Student" }]} />
            <StudentTable setSelectedRows={handleSetSelected}>
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

            </StudentTable>
            <StudentDialog isEdit={modifySnap.isEdit} />
            <StudentDeleteDialog />
            <StudentBatchDeleteDialog />
        </>
    )
}

