"use client"

import { ClassroomType } from "../../interfaces/ClassroomType";

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
import { useEffect, useState } from "react";
import { authorizedFetch } from "../../utils/authorizedFetcher";
import { AttendeeType, AttendeeVisibleName } from "../../interfaces/AttendeeTypes";
import { attendeeColumns } from "./attendeeColumns";
import { attendeeStore } from "../../stores/attendeeStores";
import { useSnapshot } from "valtio";



export function AttendeeTable({ children, setSelectedRows }: {
    children?: React.ReactNode,
    setSelectedRows?:
        (rows: Row<AttendeeType>[]) => void
}) {
    const store = attendeeStore;
    const snap = useSnapshot(store)
    const data = snap.data


    const fetchData = async () => {
        const resp = await authorizedFetch("/api/Attendee")
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
            <DataTable columns={attendeeColumns} data={data} filter initialFilterId={"studentId"}
                visible initialVisibility={{
                    createdAt: false,
                    lastUpdated: false,
                }}
                visibleName={AttendeeVisibleName}
                setSelectedRow={setSelectedRows} >
                {children}
            </DataTable>
        </div>
    )
}
