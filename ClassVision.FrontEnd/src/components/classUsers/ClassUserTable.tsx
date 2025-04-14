"use client"


import {
    Row,
} from "@tanstack/react-table"

import { DataTable } from "../ui/data-table";
import { useEffect } from "react";
import { authorizedFetch } from "../../utils/authorizedFetcher";
import { ClassUserType, StudentVisibleName } from "../../interfaces/ClassUserTypes";
import { studentColumns } from "./classUserColumns";
import { classUserStore } from "../../stores/classUserStores";
import { useSnapshot } from "valtio";



export function ClassUserTable({ children, setSelectedRows }: {
    children?: React.ReactNode,
    setSelectedRows?:
        (rows: Row<ClassUserType>[]) => void
}) {
    const store = classUserStore;
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
                    isActive: false
                }}
                visibleName={StudentVisibleName}
                setSelectedRow={setSelectedRows} >
                {children}
            </DataTable>
        </div>
    )
}
