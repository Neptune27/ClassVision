"use client"


import {
    Row,
} from "@tanstack/react-table"

import { DataTable } from "../ui/data-table";
import { useEffect } from "react";
import { authorizedFetch } from "../../utils/authorizedFetcher";
import { ScheduleType, ScheduleVisibleName } from "../../interfaces/ScheduleTypes";
import { scheduleColumns } from "./scheduleColumns";
import { scheduleStore } from "../../stores/scheduleStores";
import { useSnapshot } from "valtio";



export function ScheduleTable({ children, setSelectedRows }: {
    children?: React.ReactNode,
    setSelectedRows?:
        (rows: Row<ScheduleType>[]) => void
}) {

    const store = scheduleStore;
    const snap = useSnapshot(store)
    const data = snap.data

    const fetchData = async () => {
        const resp = await authorizedFetch("/api/Schedule")
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
            <DataTable columns={scheduleColumns} data={data} filter initialFilterId={"id"}
                visible initialVisibility={{
                    createdAt: false,
                    lastUpdated: false,
                }}
                visibleName={ScheduleVisibleName}
                setSelectedRow={setSelectedRows} >
                {children}
            </DataTable>
        </div>
    )
}
