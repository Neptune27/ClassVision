"use client"


import {
    Row,
} from "@tanstack/react-table"

import { DataTable } from "../ui/data-table";
import { useEffect } from "react";
import { authorizedFetch } from "../../utils/authorizedFetcher";
import { RoleType, RoleVisibleName } from "../../interfaces/RoleType";
import { roleStore } from "../../stores/roleStores";
import { useSnapshot } from "valtio";
import { triggerFetch } from "../../lib/utils"; // Added import
import { roleColumns } from "./roleColumns";


export function RoleTable({ children, setSelectedRows }: {
    children?: React.ReactNode,
    setSelectedRows?:
    (rows: Row<RoleType>[]) => void
}) {

    const store = roleStore;
    const snap = useSnapshot(store)
    const data = snap.data

    const fetchData = async () => {
        const resp = await authorizedFetch("/api/Account/Roles")
        store.data = await resp.json()
        console.log(store)

    }

    useEffect(() => {
        fetchData()
    }, [snap.fetchTrigger])

    useEffect(() => {
        //fetchData()
        triggerFetch(store)
    }, [])


    return (
        <div className="container mx-auto p-10">
            <DataTable columns={roleColumns} data={data} filter initialFilterId={"global" }
                visible
                visibleName={RoleVisibleName}
                setSelectedRow={setSelectedRows} >
                {children}
            </DataTable>
        </div>
    )
}

