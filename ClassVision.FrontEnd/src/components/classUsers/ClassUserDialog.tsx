"use client"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ModifyDialog } from "../dialogs/ModifyDialog"
import { useSnapshot } from "valtio"
import { useEffect, useState } from "react"
import { authorizedFetch } from "../../utils/authorizedFetcher"
import { DeleteDialog } from "../dialogs/DeleteDialog"
import { ClassUserModifyType } from "../../interfaces/ClassUserTypes"
import { classUserDeleteStore, classUserBatchDeleteStore, classUserModifyStore, classUserStore } from "../../stores/classUserStores"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { DatePicker } from "../ui/date-picker"
import { format } from "date-fns"
import { DateTimePicker } from "../ui/datetime-picker"
import { triggerFetch } from "../../lib/utils"


const baseUrl = "/api/Student"

export function ClassUserDeleteDialog() {
    const store = classUserDeleteStore;
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
        triggerFetch(classUserStore)

    }

    return (
        <DeleteDialog open={snap.opened} title={"Are you sure you want to delete this"}
            handleOnOpenChanged={handleOpen}
            handleSubmit={handleSubmit}
            
        />

    )
}


export function ClassUserBatchDeleteDialog() {
    const store = classUserBatchDeleteStore
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
        triggerFetch(classUserStore)

    }

    return (
        <DeleteDialog open={snap.opened} title={`Are you sure you want to delete ${snap.ids.length} item(s)`}
            handleOnOpenChanged={handleOpen}
            handleSubmit={handleSubmit}

        />

    )
}


export function ClassUserDialog({ isEdit }: {
    isEdit: boolean
}) {
    const store = classUserModifyStore

    const snap = useSnapshot(store)

    const [title, setTitle] = useState("")

    useEffect(() => {
        setTitle(snap.isEdit ? "Edit" : "Create")
    }, [snap.isEdit])

    const handleOpen = (open: boolean) => {
        store.opened = open
    }

    const handleEdit = async (sentData: ClassUserModifyType) => {
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
            throw resp.text
        }

        console.log(resp.status)
        store.opened = false
    }

    const handleCreate = async (sentData: ClassUserModifyType) => {
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
            ...snap.data
        }

        isEdit ? await handleEdit(data) : await handleCreate(data);
        triggerFetch(classUserStore)

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
                    <Label htmlFor="firstName" className="text-right">
                        First Name
                    </Label>
                    <Input id="firstName" value={snap.data.firstName} onChange={(e) => {

                        store.data.firstName = e.target.value
                    }
                    }
                        className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="firstName" className="text-right">
                        Last Name
                    </Label>
                    <Input id="firstName" value={snap.data.lastName} onChange={(e) => {

                        store.data.lastName = e.target.value
                    }
                    }
                        className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="media" className="text-right">
                        Profile
                    </Label>
                    <Input id="media" value={snap.data.media} onChange={(e) => {

                        store.data.media = e.target.value
                    }}
                        className="col-span-3" />
                </div>

            </div>
        </ModifyDialog>
    )
}
