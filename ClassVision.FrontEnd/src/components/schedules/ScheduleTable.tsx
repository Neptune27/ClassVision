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
import { use, useEffect, useState } from "react";
import { authorizedFetch } from "../../utils/authorizedFetcher";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { CourseInfoType } from "../../interfaces/CourseInfoType";
import { ScheduleType } from "../../interfaces/ScheduleTypes";
import { scheduleColumns } from "./scheduleColumns";



export function ScheduleTable({ children, setSelectedRows }: {
    children?: React.ReactNode,
    setSelectedRows?:
        (rows: Row<ScheduleType>[]) => void
}) {
    const [data, setData] = useState<ScheduleType[]>([])


    useEffect(() => {
        const fetchData = async () => {
            const resp = await authorizedFetch("/api/Schedule")
            setData(await resp.json())
        }

        fetchData()
    }, [])


    return (
        <div className="container mx-auto p-10">
            <DataTable columns={scheduleColumns} data={data} filter filterId={"id"}
                visible initialVisibility={{
                    createdAt: false,
                    lastUpdated: false,
                }}
                setSelectedRow={setSelectedRows} >
                {children}
            </DataTable>
        </div>
    )
}
