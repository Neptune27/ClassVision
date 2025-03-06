"use client"

import {
    Row,
} from "@tanstack/react-table"

import { DataTable } from "../ui/data-table";
import { useEffect } from "react";
import { authorizedFetch } from "../../utils/authorizedFetcher";
import { EnrollmentType, EnrollmentVisibleName } from "../../interfaces/EnrollmentTypes";
import { enrollmentColumns } from "./enrollmentColumns";
import { enrollmentStore } from "../../stores/enrollmentStores";
import { useSnapshot } from "valtio";



export function EnrollmentTable({ children, setSelectedRows }: {
    children?: React.ReactNode,
    setSelectedRows?:
        (rows: Row<EnrollmentType>[]) => void
}) {

    const store = enrollmentStore;
    const snap = useSnapshot(store)
    const data = snap.data

    const fetchData = async () => {
        const resp = await authorizedFetch("/api/Enrollment")
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
