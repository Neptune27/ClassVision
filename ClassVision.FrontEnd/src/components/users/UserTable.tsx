"use client"


import {
    Row,
} from "@tanstack/react-table"

import { DataTable } from "../ui/data-table";
import { useEffect } from "react";
import { authorizedFetch } from "../../utils/authorizedFetcher";
import { UserType, UserVisibleName } from "../../interfaces/UserTypes";
import { userColumns } from "./userColumns";
import { userStore } from "../../stores/userStores";
import { useSnapshot } from "valtio";
import { triggerFetch } from "../../lib/utils"; // Added import


export function UserTable({ children, setSelectedRows }: {
    children?: React.ReactNode,
    setSelectedRows?:
        (rows: Row<UserType>[]) => void
}) {

    const store = userStore;
    const snap = useSnapshot(store)
    const data = snap.data

    const fetchData = async () => {
        const resp = await authorizedFetch("/api/Account")
        store.data = await resp.json()
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
            <DataTable columns={userColumns} data={data} filter initialFilterId={"id"}
                visible 
                visibleName={UserVisibleName}
                setSelectedRow={setSelectedRows} >
                {children}
            </DataTable>
        </div>
    )
}

