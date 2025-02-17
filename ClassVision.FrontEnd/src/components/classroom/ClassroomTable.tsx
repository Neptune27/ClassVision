"use client"

import { ClassroomType } from "../../../interfaces/ClassroomType";

import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
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
import { use, useEffect, useState } from "react";
import { authorizedFetch } from "../../utils/authorizedFetcher";

const tempData: ClassroomType[] = [
    {
        "roomId": "TEST",
        "capacity": 1,
        "createdAt": "2025-02-15T09:04:40.396837+00:00",
        "lastUpdated": "2025-02-15T09:04:40.396865+00:00",
        "isActive": true
    },
    {
        "roomId": "TEST2",
        "capacity": 10,
        "createdAt": "2025-02-15T09:04:40.396837+00:00",
        "lastUpdated": "2025-02-17T09:04:40.396865+00:00",
        "isActive": true
    }
]


export default function ClassroomTable() {
    const [data, setData] = useState<ClassroomType[]>([])


    useEffect(() => {
        const fetchData = async () => {
            const resp = await authorizedFetch("/api/classroom")
            setData(await resp.json())
        }

        fetchData()
    }, [])

    return (
        <div className="container mx-auto p-10">
            <DataTable columns={classroomColumns} data={data} filter filterId={"roomId"} visible />
        </div>
    )
}
