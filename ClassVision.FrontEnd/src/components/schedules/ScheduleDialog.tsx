"use client"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ModifyDialog } from "../dialogs/ModifyDialog"
import { useSnapshot } from "valtio"
import { useEffect, useState } from "react"
import { authorizedFetch } from "../../utils/authorizedFetcher"
import { DeleteDialog } from "../dialogs/DeleteDialog"
import { ScheduleModifyType } from "../../interfaces/ScheduleTypes"
import { scheduleDeleteStore, scheduleBatchDeleteStore, scheduleModifyStore } from "../../stores/scheduleStores"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { DatePicker } from "../ui/date-picker"
import { format } from "date-fns"
import { Combobox, ComboboxData } from "../ui/combobox"
import { DateTimePicker } from "../ui/datetime-picker"
import { getDisplayId } from "../../lib/utils"
import { CourseInfoType } from "../../interfaces/CourseInfoType"
import { CourseType } from "../../interfaces/CourseTypes"
import { EGender } from "../../interfaces/TeacherTypes"
import { Card, CardContent } from "../ui/card"
import { Button } from "react-day-picker"
import { SimpleTimePicker } from "../ui/simple-time-picker"
import { DateTime } from "luxon"


const baseUrl = "/api/Schedule"
const courseUrl = "/api/Course"

export function ScheduleDeleteDialog() {
    const store = scheduleDeleteStore;
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


export function ScheduleBatchDeleteDialog() {
    const store = scheduleBatchDeleteStore
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
    }

    return (
        <DeleteDialog open={snap.opened} title={`Are you sure you want to delete ${snap.ids.length} item(s)`}
            handleOnOpenChanged={handleOpen}
            handleSubmit={handleSubmit}

        />

    )
}


export function ScheduleDialog({ isEdit }: {
    isEdit: boolean
}) {
    const store = scheduleModifyStore

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

    const handleEdit = async (sentData: ScheduleModifyType) => {
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

    const handleCreate = async (sentData: ScheduleModifyType) => {
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

        data.courseId = getDisplayId(data.courseId)

        //data.userId = userData.find(u => u.userName == data.userId)?.id ?? ""

        //data.birthday = format(data.birthday, 'yyyy-MM-dd')
        //data.hireDate = format(data.hireDate, 'yyyy-MM-dd')
        isEdit ? handleEdit(data) : handleCreate(data);
    }


    useEffect(() => {
        if (!snap.opened) {
            return
        }

        const fetchData = async () => {
            const resp = await authorizedFetch(`${courseUrl}/`)
            const data = await resp.json()

            const result = data.map((datum: CourseType) => {
                const value = `${datum.id} | ${datum.teacher.id} ${datum.classroom.roomId}`

                return ({
                    value: value,
                    label: value
                })
            })

            setCoursesData({
                data: data,
                display: result
            })
        }

        fetchData()
    }, [snap.opened])

    const handleDateChange = (date: Date | undefined) => {
        if (!date) {
            return
        }

        const dateString = DateTime.fromJSDate(date).toISODate();
        if (!dateString) {
            return
        }
        store.data.date = dateString
    }

    const handleTimeChange = (date: Date | undefined, type: "startTime" | "endTime") => {
        if (!date) {
            return
        }

        const dateString = DateTime.fromJSDate(date).toISOTime();
        if (!dateString) {
            return
        }
        store.data[type] = dateString
    }


    return (
        <ModifyDialog open={snap.opened} handleOnOpenChanged={handleOpen}
            title={title} handleSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="id" className="text-right">
                        Id
                    </Label>
                    <Input id="id" value={snap.data.id} disabled={snap.isEdit} onChange={(e) => {

                        store.data.id = e.target.value
                    }
                    } className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="teacherId" className="text-right">
                        Course
                    </Label>
                    <Combobox value={snap.data.courseId} onValueChange={(value) => {
                        store.data.courseId = courses?.display.find(item => item.label == value)?.value ?? ""
                    }}
                        data={courses.display}
                        className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="teacherId" className="text-right">
                        Schedule
                    </Label>
                    <div className="col-span-3 flex flex-col gap-4">
                        <Card>
                            <CardContent className="p-4">
                                <div className={"grid grid-cols-8 gap-2"}>
                                    <div className="col-span-8">
                                        <DateTimePicker value={new Date(snap.data.date)} modal={true}
                                            onChange={(date) => { handleDateChange(date) }} hideTime />
                                    </div>
                                    <div className="col-span-4">
                                        <SimpleTimePicker modal={true} value={new Date(`2000-01-01T${store.data.startTime}`)}
                                            onChange={(date) => handleTimeChange(date, "startTime")} />
                                    </div>
                                    <div className="col-span-4">
                                        <SimpleTimePicker modal={true} value={new Date(`2000-01-01T${store.data.endTime}`)}
                                            onChange={(date) => handleTimeChange(date, "endTime")} />
                                    </div>

                                </div>
                            </CardContent>
                        </Card>

                    </div>
                </div>
            </div>
        </ModifyDialog>
    )
}
