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
import { EnrollmentType } from "../../interfaces/EnrollmentTypes";
import { enrollmentColumns } from "./enrollmentColumns";



export function EnrollmentTable({ children, setSelectedRows }: {
    children?: React.ReactNode,
    setSelectedRows?:
        (rows: Row<EnrollmentType>[]) => void
}) {
    const [data, setData] = useState<EnrollmentType[]>([])


    useEffect(() => {
        const fetchData = async () => {
            const resp = await authorizedFetch("/api/Enrollment")
            setData(await resp.json())
        }

        fetchData()
    }, [])


    return (
        <div className="container mx-auto p-10">
            <DataTable columns={enrollmentColumns} data={data} filter filterId={"studentId"}
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
