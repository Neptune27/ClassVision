"use client"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ModifyDialog } from "../dialogs/ModifyDialog"
import { useSnapshot } from "valtio"
import { useEffect, useState } from "react"
import { authorizedFetch } from "../../utils/authorizedFetcher"
import { DeleteDialog } from "../dialogs/DeleteDialog"
import { courseInfoBatchDeleteStore, courseInfoDeleteStore, courseInfoModifyStore, courseInfoStore } from "../../stores/courseInfoStore"
import { ClassroomModifyType } from "../../interfaces/ClassroomType"
import { CourseInfoModifyType } from "../../interfaces/CourseInfoType"
import { triggerFetch } from "../../lib/utils"


const baseUrl = "/api/CourseInfo"

export function CourseInfoDeleteDialog() {
    const store = courseInfoDeleteStore;
    const snap = useSnapshot(store)

    const handleOpen = (open: boolean) => {
        store.opened = open
    }


    const handleSubmit = async () => {
        console.log(store)
        const url = `${baseUrl}/${store.id}`
        const resp = await authorizedFetch(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'text/plain;charset=UTF-8'
            }
        })
        const data = await resp.text()
        console.log(data)
        triggerFetch(courseInfoStore)

    }

    return (
        <DeleteDialog open={snap.opened} title={"Are you sure you want to delete this"}
            handleOnOpenChanged={handleOpen}
            handleSubmit={handleSubmit}
            
        />

    )
}


export function CourseInfoBatchDeleteDialog() {
    const store = courseInfoBatchDeleteStore
    const snap = useSnapshot(store)

    const handleOpen = (open: boolean) => {
        store.opened = open
    }


    const handleSubmit = async () => {
        console.log(store)
        const promisedResps = snap.ids.map(id => {
            const url = `${baseUrl}/${ id }`
            return authorizedFetch(url, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'text/plain;charset=UTF-8'
                }
            })
        })

        const resps = await Promise.all(promisedResps)

        console.log(resps.map((resp) => resp.status))
        triggerFetch(courseInfoStore)

    }

    return (
        <DeleteDialog open={snap.opened} title={`Are you sure you want to delete ${snap.ids.length} item(s)`}
            handleOnOpenChanged={handleOpen}
            handleSubmit={handleSubmit}

        />

    )
}


export function CourseInfoDialog({ isEdit }: {
    isEdit: boolean
}) {
    const store = courseInfoModifyStore

    const snap = useSnapshot(store)

    const [title, setTitle] = useState("")

    useEffect(() => {
        setTitle(snap.isEdit ? "Edit" : "Create")
    }, [snap.isEdit])

    const handleOpen = (open: boolean) => {
        store.opened = open
    }

    const handleEdit = async (sentData: CourseInfoModifyType) => {
        const url = `${baseUrl}/${snap.data.id}`
        console.log(url)
        const resp = await authorizedFetch(url, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(sentData)
        })


        if (!resp.ok) {
            throw await resp.text()
        }

        console.log(resp.status)
        store.opened = false
    }

    const handleCreate = async (sentData: CourseInfoModifyType) => {
        const url = `${baseUrl}`
        console.log(url)
        const resp = await authorizedFetch(url, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(sentData)
        })

        if (!resp.ok) {
            throw await resp.text()
        }

        console.log(resp.status)
        store.opened = false
    }


    const handleSubmit = async () => {
        console.log(store)
        const data = {
            id: store.data.id,
            name: store.data.name
        }

        isEdit ? await handleEdit(data) : await handleCreate(data);
        triggerFetch(courseInfoStore)

    }

    return (
        <ModifyDialog open={snap.opened} handleOnOpenChanged={handleOpen}
            title={title} handleSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="id" className="text-right">
                        Id
                    </Label>
                    <Input id="id" value={snap.data.id} onChange={(e) => {

                        store.data.id = e.target.value
                    }
                    } className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                        Name
                    </Label>
                    <Input id="name" value={snap.data.name} onChange={(e) => {

                        store.data.name = e.target.value
                    }
                    }
                        className="col-span-3" />
                </div>
            </div>
        </ModifyDialog>
    )
}
