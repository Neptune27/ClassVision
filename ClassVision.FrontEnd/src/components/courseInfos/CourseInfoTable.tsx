"use client"

import { ClassroomType } from "../../interfaces/ClassroomType";

import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    Row,
    useReactTable,
} from "@tanstack/react-table"

i
import { DataTable } from "../ui/data-table";
import { use, useEffect, useState } from "react";
import { authorizedFetch } from "../../utils/authorizedFetcher";
import { CourseInfoType, CourseInfoVisibleName } from "../../interfaces/CourseInfoType";
import { courseInfoColumns } from "./courseInfoColumns";
import { courseInfoStore } from "../../stores/courseInfoStore";
import { useSnapshot } from "valtio";



export function CourseInfoTable({ children, setSelectedRows }: {
    children?: React.ReactNode,
    setSelectedRows?:
        (rows: Row<CourseInfoType>[]) => void
}) {

    const store = courseInfoStore;
    const snap = useSnapshot(store)
    const data = snap.data

    const fetchData = async () => {
        const resp = await authorizedFetch("/api/CourseInfo")
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
            <DataTable columns={courseInfoColumns} data={data}
                filter initialFilterId={"id"}
                visible
                visibleName={CourseInfoVisibleName}

                setSelectedRow={setSelectedRows} >
                {children}
            </DataTable>
        </div>
    )
}
