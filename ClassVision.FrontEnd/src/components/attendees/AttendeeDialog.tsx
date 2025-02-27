"use client"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ModifyDialog } from "../dialogs/ModifyDialog"
import { useSnapshot } from "valtio"
import { useEffect, useState } from "react"
import { authorizedFetch } from "../../utils/authorizedFetcher"
import { DeleteDialog } from "../dialogs/DeleteDialog"
import { AttendeeModifyType, EAttendantStatus } from "../../interfaces/AttendeeTypes"
import { attendeeDeleteStore, attendeeBatchDeleteStore, attendeeModifyStore } from "../../stores/attendeeStores"
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
import { StudentType } from "../../interfaces/StudentTypes"
import { ScheduleType } from "../../interfaces/ScheduleTypes"


const baseUrl = "/api/Attendee"
const courseUrl = "/api/Course"
const scheduleUrl = "/api/Schedule"
const studentUrl = "/api/Student"

export function AttendeeDeleteDialog() {
    const store = attendeeDeleteStore;
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


export function AttendeeBatchDeleteDialog() {
    const store = attendeeBatchDeleteStore
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


export function AttendeeDialog({ isEdit }: {
    isEdit: boolean
}) {
    const store = attendeeModifyStore

    const snap = useSnapshot(store)

    const [title, setTitle] = useState("")
    const [courses, setCoursesData] = useState<{
        data: CourseType[],
        display: ComboboxData[]
    }>({
        data: [],
        display: []
    })

    const [studentData, setStudentData] = useState<{
        data: StudentType[],
        display: ComboboxData[]
    }>({
        data: [],
        display: []
    })

    const [schedule, setScheduleData] = useState<{
        data: ScheduleType[],
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

    const handleEdit = async (sentData: AttendeeModifyType) => {
        const url = `${baseUrl}/${snap.data.courseId}|${snap.data.studentId}`
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

    const handleCreate = async (sentData: AttendeeModifyType) => {
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
        data.studentId = getDisplayId(data.studentId)
        data.scheduleId = getDisplayId(data.scheduleId)

        //data.userId = userData.find(u => u.userName == data.userId)?.id ?? ""

        //data.birthday = format(data.birthday, 'yyyy-MM-dd')
        //data.hireDate = format(data.hireDate, 'yyyy-MM-dd')
        isEdit ? handleEdit(data) : handleCreate(data);
    }


    useEffect(() => {
        if (!snap.opened) {
            return
        }

        const fetchCourse = async () => {
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

        fetchCourse()
    }, [snap.opened])

    useEffect(() => {
        const fetchSchedule = async () => {
            if (!snap.data.courseId) {
                console.log("Course id is empty")
                return
            }

            const courseId = getDisplayId(snap.data.courseId)

            const resp = await authorizedFetch(`${scheduleUrl}?courseId=${courseId}`)
            const data = await resp.json()

            const result = data.map((datum: ScheduleType) => {
                const value = `${datum.id} | ${datum.course.courseInfo.name} ${datum.course.classroom.roomId}`

                return ({
                    value: value,
                    label: value
                })
            })

            setScheduleData({
                data: data,
                display: result
            })
        }

        fetchSchedule()
    }, [snap.data.courseId])

    useEffect(() => {
        const fetchStudents = async () => {
            if (!snap.data.courseId) {
                console.log("Course id is empty")
                return 
            }
            const courseId = getDisplayId(snap.data.courseId)
            const resp = await authorizedFetch(`${studentUrl}/byCourse/${courseId}`)
            const data = await resp.json()

            const result = data.map((datum: StudentType) => {
                const value = `${datum.id} | ${datum.firstName} ${datum.lastName}`

                return ({
                    value: value,
                    label: value
                })
            })

            setStudentData({
                data: data,
                display: result
            })

        }

        fetchStudents()
    }, [snap.data.courseId])



    return (
        <ModifyDialog open={snap.opened} handleOnOpenChanged={handleOpen}
            title={title} handleSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">

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
                        Student
                    </Label>
                    <Combobox value={snap.data.studentId} onValueChange={(value) => {
                        store.data.studentId = studentData?.display.find(item => item.label == value)?.value ?? ""
                    }}
                        data={studentData.display}
                        className="col-span-3" />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="teacherId" className="text-right">
                        Schedule
                    </Label>
                    <Combobox modal value={snap.data.scheduleId} onValueChange={(value) => {
                        store.data.scheduleId = schedule?.display.find(item => item.label == value)?.value ?? ""
                    }}
                        data={schedule.display}
                        className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="status" className="text-right">
                        Status
                    </Label>
                    <Select value={snap.data.status.toString()} onValueChange={(value) => {
                        store.data.status = parseInt(value)
                    }} >
                        <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Gender" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value={EAttendantStatus.PRESENT.toString()}>Present</SelectItem>
                            <SelectItem value={EAttendantStatus.LATE.toString()}>Late</SelectItem>
                            <SelectItem value={EAttendantStatus.ABSENT.toString()}>Absent</SelectItem>
                            <SelectItem value={EAttendantStatus.EXCUSED.toString()}>Excused</SelectItem>
                            <SelectItem value={EAttendantStatus.OTHER.toString()}>Other</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </ModifyDialog>
    )
}
