"use client"

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../../ui/card"
import { Button } from "../../ui/button"
import { useEffect, useState } from "react"
import { CourseType } from "../../../interfaces/CourseTypes"
import { useSnapshot } from "valtio"
import { courseDefault, courseDeleteStore, courseModifyStore, courseStore } from "../../../stores/courseStores"
import { authorizedFetch } from "../../../utils/authorizedFetcher"
import Link from "next/link"
import { DateTime } from "luxon"
import { CourseDeleteDialog, CourseDialog } from "../../courses/CourseDialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "../../ui/dropdown-menu"
import { MoreVertical } from "lucide-react"






export function ClassContent() {

    const store = courseStore;
    const modifyStore = courseModifyStore;
    const deleteStore = courseDeleteStore;
    const snap = useSnapshot(store)
    const data = snap.data

    const handleCreate = () => {
        modifyStore.data = courseDefault()
        modifyStore.isEdit = false
        modifyStore.opened = true
    }

    const [deleteTitle, setDeleteTitle] = useState("")


    const handleDelete = (id: string, isArchive: boolean) => {
        deleteStore.id = id
        setDeleteTitle(isArchive ? "Set this class to Archive" : "Do you want to delete this class")
        deleteStore.opened = true

    }

    const fetchData = async () => {
        const resp = await authorizedFetch("/api/Course/ByUser")
        store.data = await resp.json()
    }

    useEffect(() => {
        fetchData()
    }, [snap.fetchTrigger])

    useEffect(() => {
        fetchData()
    }, [])
    return (
        <>
            <CourseDialog isEdit={false} />
            <CourseDeleteDialog title={deleteTitle} />
            <div className="p-4">
                <div className="flex justify-between">
                    <h1 className="text-bold text-xl pb-4">Current:</h1>
                    <Button onClick={handleCreate}>Create new Class</Button>
                </div>
                <div className="flex flex-wrap gap-4 ">
                    {data.map(s => <Card key={s.id} className="max-w-[350px]">
                        <CardHeader className="p-6 pb-2">
                            <CardTitle >
                                <div className="flex justify-between content-center gap-2">
                                    <span className="inline-block align-middle text-2xl">
                                        {s.courseName}
                                    </span>
                                    <div>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <span className="sr-only">Open menu</span>
                                                    <MoreVertical className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                <DropdownMenuItem
                                                    onClick={() => handleDelete(s.id, s.archived)}
                                                >
                                                    {s.archived ? "Set to Archive" : "Delete class" }
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>

                                    </div>
                                </div></CardTitle>
                            <CardDescription>
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div>
                                Teacher: {s.teacher.firstName} {s.teacher.lastName}
                            </div>
                            <div>
                                Total: {s.schedules.length} Session(s)
                            </div>
                            {/*<div>*/}
                            {/*    {DateTime.fromISO(s.createdAt).toRelative()}*/}
                            {/*</div>*/}
                            <div>
                                {DateTime.fromISO(s.createdAt).toRelative()}
                            </div>
                        </CardContent>
                        <CardFooter >
                            <Link className="w-full" href={`./class/${s.id}`}>
                                <Button className="w-full">Go</Button>
                            </Link>
                        </CardFooter>
                    </Card>)}
                </div>
            </div>
        </>
        
    )
}
