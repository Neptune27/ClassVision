"use client"


import {
    ColumnDef,
    Row,
} from "@tanstack/react-table"

import { StudentClassInfoType } from "../../../interfaces/ClassInfoType";
import { classInfoStore } from "../../../stores/classInfoStore";
import { useSnapshot } from "valtio";
import { authorizedFetch } from "../../../utils/authorizedFetcher";
import { useEffect, useState } from "react";
import { DataTable } from "../../ui/data-table";
import { createColumns } from "./classDetailsColumns";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../ui/dropdown-menu";
import { Button } from "../../ui/button";


const excelUrl = "/api/Attendee/byClass/toExcel"

export function ClassDetailsTable({ children, setSelectedRows, classId }: {
    classId: string,
    children?: React.ReactNode,
    setSelectedRows?:
    (rows: Row<StudentClassInfoType>[]) => void
}) {
    const store = classInfoStore;
    const snap = useSnapshot(store)
    const data = snap.data
    const [columns, setColumns] = useState<ColumnDef<StudentClassInfoType>[]>([])


    const fetchData = async () => {
        const resp = await authorizedFetch(`/api/Attendee/byClass/${classId}`)
        store.data = await resp.json()
        console.log(store.data)
        if (store.data.length > 0)
            setColumns(createColumns(store.data[0]))
    }

    useEffect(() => {
        fetchData()
    }, [snap.fetchTrigger])

    useEffect(() => {
        fetchData()
    }, [])

    const handleExportExcel = async () => {
        const resp = await authorizedFetch(`${excelUrl}/${classId}`)
        if (!resp.ok) {
            console.error(await resp.text())
            return
        }

        const url = await resp.text();
        window.open(url, '_blank')
    }

    return (
        <div className="container mx-auto p-10">
            <DataTable columns={columns} data={data}
                filter initialFilterId="global"
                visible initialVisibility={{
                }}
                visibleName={{
                    student_id: "Student Id",
                    student_lastName: "Last Name",
                    student_firstName:"First Name"
                }}
                setSelectedRow={setSelectedRows} >
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="default" className="ml-2">
                            Actions
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={handleExportExcel}>Export to Excel</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
                {children}
            </DataTable>
        </div>
    )
}
