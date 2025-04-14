"use client"

import { useSnapshot } from "valtio"
import DbHeader from "../../../components/dashboard/DbHeader"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../../components/ui/dropdown-menu"
import { Button } from "../../../components/ui/button"
import { Row } from "@tanstack/react-table"
import { ClassUserDialog, ClassUserDeleteDialog, ClassUserBatchDeleteDialog } from "../../../components/classUsers/ClassUserDialog"
import { ClassUserTable } from "../../../components/classUsers/ClassUserTable"
import { ClassUserType } from "../../../interfaces/ClassUserTypes"
import { classUserModifyStore, classUserBatchDeleteStore, classUserDefault } from "../../../stores/classUserStores"


export default function Page() {
    const modifyStore = classUserModifyStore;
    const deleteStore = classUserBatchDeleteStore;

    const modifySnap = useSnapshot(modifyStore)
    const deleteSnap = useSnapshot(deleteStore)

    const handleCreate = () => {
        modifyStore.data = classUserDefault()

        modifyStore.isEdit = false
        modifyStore.opened = true
    }

    const handleDelete = () => {
        deleteStore.opened = true
    }


    const handleSetSelected = (rows: Row<ClassUserType>[]) => {
        deleteStore.ids = rows.map(row => row.original.id)
    }

    return (
        <>
            <DbHeader items={[{ name: "Dashboard" }, { name: "Student" }]} />
            <ClassUserTable setSelectedRows={handleSetSelected}>
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

            </ClassUserTable>
            <ClassUserDialog isEdit={modifySnap.isEdit} />
            <ClassUserDeleteDialog />
            <ClassUserBatchDeleteDialog />
        </>
    )
}

