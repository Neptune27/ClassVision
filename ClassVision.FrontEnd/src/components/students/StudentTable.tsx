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
import { StudentType, StudentVisibleName } from "../../interfaces/StudentTypes";
import { studentColumns } from "./studentColumns";



export function StudentTable({ children, setSelectedRows }: {
    children?: React.ReactNode,
    setSelectedRows?:
        (rows: Row<StudentType>[]) => void
}) {
    const [data, setData] = useState<StudentType[]>([])


    useEffect(() => {
        const fetchData = async () => {
            const resp = await authorizedFetch("/api/Student")
            setData(await resp.json())
        }

        fetchData()
    }, [])


    return (
        <div className="container mx-auto p-10">
            <DataTable columns={studentColumns} data={data} filter initialFilterId={"id"}
                visible initialVisibility={{
                    createdAt: false,
                    lastUpdated: false,
                    address: false,
                    birthday: false,
                    enrollAt: false
                }}
                visibleName={StudentVisibleName}
                setSelectedRow={setSelectedRows} >
                {children}
            </DataTable>
        </div>
    )
}
