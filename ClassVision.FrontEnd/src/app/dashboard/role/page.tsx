"use client"

import { useSnapshot } from "valtio"
import DbHeader from "../../../components/dashboard/DbHeader"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../../components/ui/dropdown-menu"
import { Button } from "../../../components/ui/button"
import { Row } from "@tanstack/react-table"
//import { RoleDialog, RoleDeleteDialog, RoleBatchDeleteDialog } from "../../../components/roles/RoleDialog"
import { RoleTable } from "../../../components/roles/RoleTable"
import { RoleType } from "../../../interfaces/RoleType"
import RoleSelectorDialog from "../../../components/roles/RoleSelectorDialog"


export default function Page() {

    return (
        <>
            <DbHeader items={[{ name: "Dashboard" }, { name: "Role" }]} />
            <RoleTable >
            </RoleTable>
            <RoleSelectorDialog/>

        </>
    )
}

