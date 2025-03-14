﻿"use client"

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
import { TeacherType, TeacherVisibleName } from "../../interfaces/TeacherTypes";
import { teacherColumns } from "./teacherColumns";
import { teacherStore } from "../../stores/teacherStores";
import { useSnapshot } from "valtio";

export function TeacherTable({ children, setSelectedRows }: {
    children?: React.ReactNode,
    setSelectedRows?:
        (rows: Row<TeacherType>[]) => void
}) {

    const store = teacherStore;
    const snap = useSnapshot(store)
    const data = snap.data

    const fetchData = async () => {
        const resp = await authorizedFetch("/api/Teacher")
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
            <DataTable columns={teacherColumns} data={data} filter initialFilterId={"id"}
                visible initialVisibility={{
                    createdAt: false,
                    lastUpdated: false,
                    address: false,
                    birthday: false,
                    hireDate: false
                }}
                visibleName={TeacherVisibleName }
                setSelectedRow={setSelectedRows} >
                {children}
            </DataTable>
        </div>
    )
}
