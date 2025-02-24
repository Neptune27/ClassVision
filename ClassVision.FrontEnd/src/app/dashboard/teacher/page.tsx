"use client"

import { useSnapshot } from "valtio"
import DbHeader from "../../../components/dashboard/DbHeader"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../../components/ui/dropdown-menu"
import { Button } from "../../../components/ui/button"
import { Row } from "@tanstack/react-table"
import { TeacherDialog, TeacherDeleteDialog, TeacherBatchDeleteDialog } from "../../../components/teachers/TeacherDialog"
import { TeacherTable } from "../../../components/teachers/TeacherTable"
import { TeacherType } from "../../../interfaces/TeacherTypes"
import { teacherModifyStore, teacherBatchDeleteStore, teacherDefault } from "../../../stores/teacherStores"
import { CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem, CommandSeparator } from "cmdk"
import { Command, Calendar, Smile, Calculator, User, CreditCard, Settings } from "lucide-react"
import { CommandShortcut } from "../../../components/ui/command"


export default function Page() {
    const modifyStore = teacherModifyStore;
    const deleteStore = teacherBatchDeleteStore;

    const modifySnap = useSnapshot(modifyStore)
    const deleteSnap = useSnapshot(deleteStore)

    const handleCreate = () => {
        modifyStore.data = teacherDefault()

        modifyStore.isEdit = false
        modifyStore.opened = true
    }

    const handleDelete = () => {
        deleteStore.opened = true
    }


    const handleSetSelected = (rows: Row<TeacherType>[]) => {
        deleteStore.ids = rows.map(row => row.original.id)
    }

    return (
        <>
            <DbHeader items={[{ name: "Dashboard" }, { name: "Teacher" }]} />
            <TeacherTable setSelectedRows={handleSetSelected}>
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

            </TeacherTable>
            <TeacherDialog isEdit={modifySnap.isEdit} />
            <TeacherDeleteDialog />
            <TeacherBatchDeleteDialog />
        </>
    )
}

