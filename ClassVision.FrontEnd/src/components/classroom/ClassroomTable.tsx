"use client"

import { ClassroomType, ClassroomVisibleName } from "../../interfaces/ClassroomType";

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
import { DataTable } from "../ui/data-table";
import { classroomColumns } from "./classroomColumns";
import { useEffect, useState } from "react";
import { authorizedFetch } from "../../utils/authorizedFetcher";
import { classroomStore } from "../../stores/classroomStores";
import { useSnapshot } from "valtio";
export default function ClassroomTable({ children, setSelectedRows }: { children?: React.ReactNode, setSelectedRows?: (rows: Row<ClassroomType>[]) => void }) {

    const store = classroomStore;
    const snap = useSnapshot(store)
    const data = snap.data

    const fetchData = async () => {
        const resp = await authorizedFetch("/api/classroom")
        store.data = await resp.json()
    }

    useEffect(() => {
        fetchData()
    }, [snap.fetchTrigger])

    useEffect(() => {
        fetchData()
    }, [])



    return (
        <div className="container mx-auto p-10">
            <DataTable columns={classroomColumns} data={data}
                filter initialFilterId={"roomId"}
                visible
                visibleName={ClassroomVisibleName}

                setSelectedRow={setSelectedRows} >

                {children}
            </DataTable>
        </div>
    )
}
