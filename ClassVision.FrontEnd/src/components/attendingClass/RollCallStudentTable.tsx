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
import { use, useCallback, useEffect, useState } from "react";
import { authorizedFetch } from "../../utils/authorizedFetcher";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { CourseInfoType } from "../../interfaces/CourseInfoType";
import { ClassUserType } from "../../interfaces/ClassUserTypes";
import { studentColumns } from "../classUsers/classUserColumns";
import { attendeeWithNameColumns } from "./attendeeWithNameColumns";
import { AttendeeType, AttendeeVisibleName } from "../../interfaces/AttendeeTypes";
import { rollCallStore } from "../../stores/rollcallStores";
import { useSnapshot } from "valtio";



export function RollCallStudentTable({ children, setSelectedRows }: {
    children?: React.ReactNode,
    setSelectedRows?:
    (rows: Row<AttendeeType>[]) => void
}) {

    const store = rollCallStore;
    const snap = useSnapshot(store)


    return (
        <div className="container mx-auto p-10">
            <DataTable columns={attendeeWithNameColumns} data={snap.attentee} filter initialFilterId={"studentId"}
                visible initialVisibility={{
                    createdAt: false,
                    lastUpdated: false,
                    courseId: false,
                    scheduleId: false,
                    id: false
                }}
                setSelectedRow={setSelectedRows}
                visibleName={AttendeeVisibleName}
            >
                {children}
            </DataTable>
        </div>
    )
}
