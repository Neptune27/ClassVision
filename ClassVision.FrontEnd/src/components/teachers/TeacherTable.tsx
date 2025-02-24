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
import { TeacherType } from "../../interfaces/TeacherTypes";
import { teacherColumns } from "./teacherColumns";



export function TeacherTable({ children, setSelectedRows }: {
    children?: React.ReactNode,
    setSelectedRows?:
        (rows: Row<TeacherType>[]) => void
}) {
    const [data, setData] = useState<TeacherType[]>([])


    useEffect(() => {
        const fetchData = async () => {
            const resp = await authorizedFetch("/api/Teacher")
            setData(await resp.json())
        }

        fetchData()
    }, [])


    return (
        <div className="container mx-auto p-10">
            <DataTable columns={teacherColumns} data={data} filter filterId={"id"}
                visible initialVisibility={{
                    createdAt: false,
                    lastUpdated: false,
                    address: false,
                    birthday: false,
                    hireDate: false
                }}
                setSelectedRow={setSelectedRows} >
                {children}
            </DataTable>
        </div>
    )
}
