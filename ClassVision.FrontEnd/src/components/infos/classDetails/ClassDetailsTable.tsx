"use client"


import {
    ColumnDef,
    Row,
} from "@tanstack/react-table"

import { StudentClassInfoType } from "../../../interfaces/ClassInfoType";
import { classInfoStore } from "../../../stores/classInfoStore";
import { useSnapshot } from "valtio";
import { authorizedFetch } from "../../../utils/authorizedFetcher";
import { useEffect, useState } from "react";
import { DataTable } from "../../ui/data-table";
import { createColumns } from "./classDetailsColumns";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "../../ui/dropdown-menu";
import { Button } from "../../ui/button";
import { QrCode, QrCodeEcc } from "../../../lib/qrcodegen";
import { toSvgString } from "../../../lib/qrUltis";
import { classUserBatchCreateStore } from "../../../stores/classUserStores";
import { ClassUserBatchAddDialog } from "../../classUsers/ClassUserBatchCreateDialog";
import { toast } from "../../../hooks/use-toast";
import { rollCallStore } from "../../../stores/rollcallStores";
import { enrollmentBatchDeleteStore } from "../../../stores/enrollmentStores";
import { EnrollmentType } from "../../../interfaces/EnrollmentTypes";
import { EnrollmentBatchDeleteDialog } from "../../enrollments/EnrollmentDialog";


const excelUrl = "/api/Attendee/byClass/toExcel"

export function ClassDetailsTable
({ children, setSelectedRows, classId }: {
    classId: string,
    children?: React.ReactNode,
    setSelectedRows?:
    (rows: Row<StudentClassInfoType>[]) => void
}) {
    const store = classInfoStore;
    const rcStore = rollCallStore;
    const dialogStore = classUserBatchCreateStore;
    const deleteStore = enrollmentBatchDeleteStore;
    const snap = useSnapshot(store)
    const rcSnap = useSnapshot(rcStore)
    const data = snap.data
    const [columns, setColumns] = useState<ColumnDef<StudentClassInfoType>[]>([])
    const [isTeacher, setIsTeacher] = useState(false)

    const fetchData = async () => {
        const resp = await authorizedFetch(`/api/Attendee/byClass/${classId}`)
        store.data = await resp.json()
        console.log(store.data)
        if (store.data.length > 0)
            setColumns(createColumns(store.data[0]))
    }

    useEffect(() => {
        fetchData()
    }, [snap.fetchTrigger, rcSnap.fetchTrigger])

    useEffect(() => {
        fetchData()
        const fetchIsTeacher = async () => {
            const resp = await authorizedFetch(`/api/Course/IsTeacher/${classId}`)
            if (!resp.ok) {
                toast({
                    value: "Error fetching is teacher",
                    variant: "destructive"
                })
            }

            setIsTeacher(await resp.json())
        }

        fetchIsTeacher()
    }, [])


    const handleAddStudents = () => {
        const qr0 = QrCode.encodeText(`https://${location.host}/clients/class/${classId}`, QrCodeEcc.MEDIUM);
        const svg = toSvgString(qr0, 4, "#FFFFFF", "#000000");

        dialogStore.qr = svg
        dialogStore.opened = true
    }

    const handleExportExcel = async () => {
        const resp = await authorizedFetch(`${excelUrl}/${classId}`)
        if (!resp.ok) {
            console.error(await resp.text())
            return
        }

        const url = await resp.text();
        window.open(url, '_blank')
    }


    const handleDelete = () => {
        deleteStore.opened = true
    }


    const handleSetSelected = (rows: Row<EnrollmentType>[]) => {
        deleteStore.ids = rows.map(row => `${row.original.courseId}|${row.original.studentId}`)
    }

    return (
        <>
            <EnrollmentBatchDeleteDialog />
            <ClassUserBatchAddDialog isEdit={false} classId={classId} />
        <div className="container mx-auto p-10">
                <DataTable columns={columns} data={data}
                filter initialFilterId="global"
                visible initialVisibility={{
                }}
                visibleName={{
                    student_id: "Student Id",
                    student_lastName: "Last Name",
                    student_firstName:"First Name"
                }}
                    setSelectedRow={handleSetSelected} >
                    {
                        isTeacher &&
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="default" className="ml-2">
                                    Actions
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={handleAddStudents}>Add students</DropdownMenuItem>
                                <DropdownMenuItem onClick={handleExportExcel}>Export to Excel</DropdownMenuItem>
                                <DropdownMenuSeparator/>
                                <DropdownMenuItem onClick={handleDelete}>Delete</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                    }
                {children}
            </DataTable>
        </div>

        </>
    )
}
