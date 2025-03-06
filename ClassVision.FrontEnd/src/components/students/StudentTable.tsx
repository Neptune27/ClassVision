"use client"


import {
    Row,
} from "@tanstack/react-table"

import { DataTable } from "../ui/data-table";
import { useEffect } from "react";
import { authorizedFetch } from "../../utils/authorizedFetcher";
import { StudentType, StudentVisibleName } from "../../interfaces/StudentTypes";
import { studentColumns } from "./studentColumns";
import { studentStore } from "../../stores/studentStores";
import { useSnapshot } from "valtio";



export function StudentTable({ children, setSelectedRows }: {
    children?: React.ReactNode,
    setSelectedRows?:
        (rows: Row<StudentType>[]) => void
}) {
    const store = studentStore;
    const snap = useSnapshot(store)
    const data = snap.data

    const fetchData = async () => {
        const resp = await authorizedFetch("/api/Student")
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
