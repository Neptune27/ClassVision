"use client"


import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    Row,
    useReactTable,
} from "@tanstack/react-table"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { StudentClassInfoType } from "../../../interfaces/ClassInfoType";
import { classInfoStore } from "../../../stores/classInfoStore";
import { useSnapshot } from "valtio";
import { authorizedFetch } from "../../../utils/authorizedFetcher";
import { useEffect, useState } from "react";
import { DataTable } from "../../ui/data-table";
import { createColumns } from "./classDetailsColumns";




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

        if (store.data.length > 0)
            setColumns(createColumns(store.data[0]))
    }

    useEffect(() => {
        fetchData()
    }, [snap.fetchTrigger])

    useEffect(() => {
        fetchData()
    }, [])



    return (
        <div className="container mx-auto p-10">
            <DataTable columns={columns} data={data}
                visible initialVisibility={{
                }}
                setSelectedRow={setSelectedRows} >
                {children}
            </DataTable>
        </div>
    )
}
