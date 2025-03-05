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
import { EnrollmentType, EnrollmentVisibleName } from "../../interfaces/EnrollmentTypes";
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
            <DataTable columns={enrollmentColumns} data={data} filter initialFilterId={"studentId"}
                visible initialVisibility={{
                    createdAt: false,
                    lastUpdated: false,
                }}
                visibleName={EnrollmentVisibleName}
                setSelectedRow={setSelectedRows} >
                {children}
            </DataTable>
        </div>
    )
}
