"use client"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ModifyDialog } from "../dialogs/ModifyDialog"
import { useSnapshot } from "valtio"
import { classroomBatchDeleteStore, classroomDeleteStore, classroomModifyStore, classroomStore } from "../../stores/classroomStores"
import { useEffect, useState } from "react"
import { authorizedFetch } from "../../utils/authorizedFetcher"
import { DeleteDialog } from "../dialogs/DeleteDialog"
import { triggerFetch } from "../../lib/utils"

const store = classroomModifyStore;

export function ClassroomDeleteDialog() {
    const snap = useSnapshot(classroomDeleteStore)

    const handleOpen = (open: boolean) => {
        classroomDeleteStore.opened = open
    }


    const handleSubmit = async () => {
        console.log(classroomDeleteStore)
        const url = `/api/Classroom/${classroomDeleteStore.id}`
        const resp = await authorizedFetch(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'text/plain;charset=UTF-8'
            }
        })
        const data = await resp.text()
        console.log(data)
        triggerFetch(classroomStore)

    }

    return (
        <DeleteDialog open={snap.opened} title={"Are you sure you want to delete this"}
            handleOnOpenChanged={handleOpen}
            handleSubmit={handleSubmit}
            
        />

    )
}


export function ClassroomBatchDeleteDialog() {
    const snap = useSnapshot(classroomBatchDeleteStore)

    const handleOpen = (open: boolean) => {
        classroomBatchDeleteStore.opened = open
    }


    const handleSubmit = async () => {
        console.log(classroomBatchDeleteStore)
        const promisedResps = snap.ids.map(id => {
            const url = `/api/Classroom/${id}`
            return authorizedFetch(url, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'text/plain;charset=UTF-8'
                }
            })
        })

        const resps = await Promise.all(promisedResps)

        console.log(resps.map((resp) => resp.status))
        triggerFetch(classroomStore)

    }

    return (
        <DeleteDialog open={snap.opened} title={`Are you sure you want to delete ${snap.ids.length} item(s)`}
            handleOnOpenChanged={handleOpen}
            handleSubmit={handleSubmit}

        />

    )
}


export function ClassroomDialog({ isEdit }: {
    isEdit: boolean
}) {
    const snap = useSnapshot(store)

    const [title, setTitle] = useState("")

    useEffect(() => {
        setTitle(snap.isEdit ? "Edit" : "Create")
    }, [snap.isEdit])

    const handleOpen = (open: boolean) => {
        store.opened = open
    }

    const handleEdit = async () => {
        const url = `/api/Classroom/${snap.data.roomId}`
        console.log(url)
        const resp = await authorizedFetch(url, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                roomId: store.data.roomId,
                capacity: store.data.capacity
            })
        })


        if (!resp.ok) {
            throw await resp.text()
        }

        console.log(resp.status)
        store.opened = false
    }

    const handleCreate = async () => {
        const url = `/api/Classroom`
        console.log(url)
        const resp = await authorizedFetch(url, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                roomId: store.data.roomId,
                capacity: store.data.capacity
            })
        })

        if (!resp.ok) {
            throw await resp.text()
        }

        console.log(resp.status)
        store.opened = false
    }


    const handleSubmit = async () => {
        console.log(store)

        isEdit ? await handleEdit() : await handleCreate();
        triggerFetch(classroomStore)

    }

    return (
        <ModifyDialog open={snap.opened} handleOnOpenChanged={handleOpen}
            title={title} handleSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="roomId" className="text-right">
                        Room Name
                    </Label>
                    <Input id="roomId" value={snap.data.roomId} onChange={(e) => {

                        store.data.roomId = e.target.value
                    }
                    } className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="capacity" className="text-right">
                        Capacity
                    </Label>
                    <Input id="capacity" value={snap.data.capacity} onChange={(e) => {

                        store.data.capacity = parseInt(e.target.value)
                    }
                    }
                        className="col-span-3" />
                </div>
            </div>
        </ModifyDialog>
    )
}
