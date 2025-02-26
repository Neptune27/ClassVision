"use client"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ModifyDialog } from "../dialogs/ModifyDialog"
import { useSnapshot } from "valtio"
import { useEffect, useState } from "react"
import { authorizedFetch } from "../../utils/authorizedFetcher"
import { DeleteDialog } from "../dialogs/DeleteDialog"
import { EGender, StudentModifyType } from "../../interfaces/StudentTypes"
import { studentDeleteStore, studentBatchDeleteStore, studentModifyStore } from "../../stores/studentStores"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { DatePicker } from "../ui/date-picker"
import { format } from "date-fns"
import { DateTimePicker } from "../ui/datetime-picker"


const baseUrl = "/api/Student"

export function StudentDeleteDialog() {
    const store = studentDeleteStore;
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
    }

    return (
        <DeleteDialog open={snap.opened} title={"Are you sure you want to delete this"}
            handleOnOpenChanged={handleOpen}
            handleSubmit={handleSubmit}
            
        />

    )
}


export function StudentBatchDeleteDialog() {
    const store = studentBatchDeleteStore
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
    }

    return (
        <DeleteDialog open={snap.opened} title={`Are you sure you want to delete ${snap.ids.length} item(s)`}
            handleOnOpenChanged={handleOpen}
            handleSubmit={handleSubmit}

        />

    )
}


export function StudentDialog({ isEdit }: {
    isEdit: boolean
}) {
    const store = studentModifyStore

    const snap = useSnapshot(store)

    const [title, setTitle] = useState("")

    useEffect(() => {
        setTitle(snap.isEdit ? "Edit" : "Create")
    }, [snap.isEdit])

    const handleOpen = (open: boolean) => {
        store.opened = open
    }

    const handleEdit = async (sentData: StudentModifyType) => {
        const url = `${baseUrl}/${snap.data.id}`
        console.log(url)
        const resp = await authorizedFetch(url, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(sentData)
        })

        const data = await resp.json()
        console.log(data)
        store.opened = false
    }

    const handleCreate = async (sentData: StudentModifyType) => {
        const url = `${baseUrl}`
        console.log(url)
        const resp = await authorizedFetch(url, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(sentData)
        })

        const data = await resp.json()
        console.log(data)
        store.opened = false
    }


    const handleSubmit = () => {
        console.log(store)
        const data = {
            ...snap.data
        }

        data.birthday = format(data.birthday, 'yyyy-MM-dd')
        data.enrollAt = format(data.enrollAt, 'yyyy-MM-dd')
        isEdit ? handleEdit(data) : handleCreate(data);
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
                    <Label htmlFor="gender" className="text-right">
                        Gender
                    </Label>
                    <Select value={ snap.data.gender.toString()} onValueChange={(value) => {
                        store.data.gender = parseInt(value)
                    }} >
                        <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Gender" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value={EGender.MALE.toString()}>Male</SelectItem>
                            <SelectItem value={EGender.FEMALE.toString()}>Female</SelectItem>
                            <SelectItem value={EGender.OTHER.toString()}>Other</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="birthday" className="text-right">
                        Birthday
                    </Label>
                    <div className="col-span-3">
                        <DateTimePicker modal={true} hideTime
                            value={new Date(snap.data.birthday)} onChange={(date) => {
                            if (date) {
                                store.data.birthday = date.toISOString()
                            }
                        }} />
                    </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="enrollAt" className="text-right">
                        Enroll At
                    </Label>
                    <div className="col-span-3">
                        <DateTimePicker modal={true} hideTime value={new Date(snap.data.enrollAt)} onChange={(date) => {
                            if (date) {
                                store.data.enrollAt = date.toISOString()
                            }
                        }} />
                    </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="phoneNumber" className="text-right">
                        Phone Number
                    </Label>
                    <Input id="phoneNumber" value={snap.data.phoneNumber} onChange={(e) => {

                        store.data.phoneNumber = e.target.value
                    }}
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
