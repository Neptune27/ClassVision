"use client"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ModifyDialog } from "../dialogs/ModifyDialog"
import { useSnapshot } from "valtio"
import { useEffect, useState } from "react"
import { authorizedFetch } from "../../utils/authorizedFetcher"
import { DeleteDialog } from "../dialogs/DeleteDialog"
import { UserModifyType } from "../../interfaces/UserTypes"
import { userDeleteStore, userBatchDeleteStore, userModifyStore, userStore } from "../../stores/userStores"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { DatePicker } from "../ui/date-picker"
import { format } from "date-fns"
import { Combobox, ComboboxData } from "../ui/combobox"
import { DateTimePicker } from "../ui/datetime-picker"
import { getDisplayId, triggerFetch } from "../../lib/utils"
import { CourseInfoType } from "../../interfaces/CourseInfoType"
import { CourseType } from "../../interfaces/CourseTypes"
import { EGender } from "../../interfaces/TeacherTypes"
import { Card, CardContent } from "../ui/card"
import { Button } from "react-day-picker"
import { SimpleTimePicker } from "../ui/simple-time-picker"
import { DateTime } from "luxon"
import { classUserStore } from "../../stores/classUserStores"
import { get } from "node:http"


const baseUrl = "/api/Account"

export function UserDeleteDialog() {
    const store = userDeleteStore;
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
        triggerFetch(userStore)

    }

    return (
        <DeleteDialog open={snap.opened} title={"Are you sure you want to delete this"}
            handleOnOpenChanged={handleOpen}
            handleSubmit={handleSubmit}

        />

    )
}


export function UserBatchDeleteDialog() {
    const store = userBatchDeleteStore
    const snap = useSnapshot(store)

    const handleOpen = (open: boolean) => {
        store.opened = open
    }


    const handleSubmit = async () => {
        console.log(store)
        const promisedResps = snap.ids.map(id => {
            const url = `${baseUrl}/${id}`
            return authorizedFetch(url, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'text/plain;charset=UTF-8'
                }
            })
        })

        const resps = await Promise.all(promisedResps)

        console.log(resps.map((resp) => resp.status))
        triggerFetch(userStore)

    }

    return (
        <DeleteDialog open={snap.opened} title={`Are you sure you want to delete ${snap.ids.length} item(s)`}
            handleOnOpenChanged={handleOpen}
            handleSubmit={handleSubmit}

        />

    )
}


export function UserDialog({ isEdit }: {
    isEdit: boolean
}) {
    const store = userModifyStore
    const triggerStore = userStore

    const snap = useSnapshot(store)

    const [title, setTitle] = useState("")
    const [courses, setCoursesData] = useState<{
        data: CourseInfoType[],
        display: ComboboxData[]
    }>({
        data: [],
        display: []
    })


    useEffect(() => {
        setTitle(snap.isEdit ? "Edit" : "Create")
    }, [snap.isEdit])

    const handleOpen = (open: boolean) => {
        store.opened = open
    }

    const handleEdit = async (sentData: UserModifyType) => {
        const url = `${baseUrl}/${snap.data.userName}`
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
        triggerFetch(userStore)
    }

    const handleCreate = async (sentData: UserModifyType) => {
        const url = `${baseUrl}/register`
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
        triggerFetch(userStore)

    }


    const handleSubmit = async () => {
        console.log(store)
        const data = {
            ...snap.data
        }
        
        isEdit ? await handleEdit(data) : await handleCreate(data);
        triggerFetch(userStore)
    }




    return (
        <ModifyDialog modal={true} open={snap.opened} handleOnOpenChanged={handleOpen}
            title={title} handleSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="username" className="text-right">
                        Username
                    </Label>
                    <Input id="username" value={snap.data.userName} disabled={snap.isEdit} onChange={(e) => {

                        store.data.userName = e.target.value
                    }
                    } className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="Email" className="text-right">
                        Email
                    </Label>
                    <Input id="email" type="email" value={snap.data.email} disabled={snap.isEdit} onChange={(e) => {

                        store.data.email = e.target.value
                    }
                    } className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="password" className="text-right">
                        Password
                    </Label>
                    <Input id="password" type="password" value={snap.data.password} disabled={snap.isEdit} onChange={(e) => {

                        store.data.password = e.target.value
                    }
                    } className="col-span-3" />
                </div>

            </div>
        </ModifyDialog>
    )
}
