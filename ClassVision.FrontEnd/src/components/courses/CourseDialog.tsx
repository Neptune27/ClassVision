"use client"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ModifyDialog } from "../dialogs/ModifyDialog"
import { useSnapshot } from "valtio"
import { useEffect, useState } from "react"
import { authorizedFetch } from "../../utils/authorizedFetcher"
import { DeleteDialog } from "../dialogs/DeleteDialog"
import { CourseModifyType } from "../../interfaces/CourseTypes"
import { courseDeleteStore, courseBatchDeleteStore, courseModifyStore } from "../../stores/courseStores"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { DatePicker } from "../ui/date-picker"
import { format } from "date-fns"
import { Combobox, ComboboxData } from "../ui/combobox"
import { TeacherType } from "../../interfaces/TeacherTypes"
import { StudentType } from "../../interfaces/StudentTypes"
import { CourseInfoType } from "../../interfaces/CourseInfoType"
import { ClassroomType } from "../../interfaces/ClassroomType"


const baseUrl = "/api/Course"
const teacherUrl = "/api/Teacher"
const classroomUrl = "/api/Classroom"
const courseInfoUrl = "/api/CourseInfo"
const studentUrl = "/api/Teacher"

export function CourseDeleteDialog() {
    const store = courseDeleteStore;
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


export function CourseBatchDeleteDialog() {
    const store = courseBatchDeleteStore
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



export function CourseDialog({ isEdit }: {
    isEdit: boolean
}) {
    const store = courseModifyStore

    const snap = useSnapshot(store)

    const [title, setTitle] = useState("")
    const [teacherData, setTeacherData] = useState<{
        data: TeacherType[],
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

    const [courseInfo, setCourseInfoData] = useState<{
        data: StudentType[],
        display: ComboboxData[]
    }>({
        data: [],
        display: []
    })


    const [rooms, setRoomsData] = useState<{
        data: ClassroomType[],
        display: ComboboxData[]
    }>({
        data: [],
        display: []
    })

    useEffect(() => {
        setTitle(snap.isEdit ? "Edit" : "Create")
    }, [snap.isEdit])


    useEffect(() => {
        if (!snap.opened) {
            return
        }

        const fetchTeachers = async () => {
            const resp = await authorizedFetch(`${teacherUrl}/`)
            const data = await resp.json()

            const result = data.map((datum: TeacherType) => {
                const value = `${datum.id} | ${datum.firstName} ${datum.lastName}`

                return ({
                    value: value,
                    label: value
                })
            })

            setTeacherData({
                data: data,
                display: result
            })
            console.log(data)

        }

        const fetchStudents = async () => {
            const resp = await authorizedFetch(`${studentUrl}/`)
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
            console.log(data)

        }

        const fetchCourseInfos = async () => {
            const resp = await authorizedFetch(`${courseInfoUrl}/`)
            const data = await resp.json()

            const result = data.map((datum: CourseInfoType) => {
                const value = `${datum.id} | ${datum.name}`

                return ({
                    value: value,
                    label: value
                })
            })

            setCourseInfoData({
                data: data,
                display: result
            })
            console.log(data)

        }

        const fetchClassroom = async () => {
            const resp = await authorizedFetch(`${classroomUrl}/`)
            const data = await resp.json()

            const result = data.map((datum: ClassroomType) => {
                const value = `${datum.roomId}`

                return ({
                    value: value,
                    label: value
                })
            })

            setRoomsData({
                data: data,
                display: result
            })

            console.log(data)
        }

        fetchTeachers()
        fetchStudents()
        fetchCourseInfos()
        fetchClassroom()

    }, [snap.opened])

    const handleOpen = (open: boolean) => {
        store.opened = open
    }

    const handleEdit = async (sentData: CourseModifyType) => {
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

    const handleCreate = async (sentData: CourseModifyType) => {
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
        console.log(data)

        //data.userId = userData.find(u => u.userName == data.userId)?.id ?? ""


        //TODO: Handle this
        //isEdit ? handleEdit(data) : handleCreate(data);
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
                    <Label htmlFor="teacherId" className="text-right">
                        Teacher
                    </Label>
                    <Combobox value={snap.data.teacherId} onValueChange={(value) => {
                        store.data.teacherId = teacherData?.display.find(item => item.label == value)?.value ?? ""
                    }}
                        data={teacherData.display}
                        className="col-span-3"/>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="teacherId" className="text-right">
                        Course Info
                    </Label>
                    <Combobox value={snap.data.courseInfoId} onValueChange={(value) => {
                        store.data.courseInfoId = courseInfo?.display.find(item => item.label == value)?.value ?? ""
                    }}
                        data={courseInfo.display}
                        className="col-span-3" />
                </div>
                {/*<div className="grid grid-cols-4 items-center gap-4">*/}
                {/*    <Label htmlFor="teacherId" className="text-right">*/}
                {/*        Student //TEMPORARY*/}
                {/*    </Label>*/}
                {/*    <Combobox value={snap.data.studentIds} onValueChange={(value) => {*/}
                {/*        store.data.teacherId = teacherData?.display.find(item => item.label == value)?.value ?? ""*/}
                {/*    }}*/}
                {/*        data={teacherData.display}*/}
                {/*        className="col-span-3" />*/}
                {/*</div>*/}
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="teacherId" className="text-right">
                        Room
                    </Label>
                    <Combobox value={snap.data.classroomId} onValueChange={(value) => {
                        store.data.classroomId = rooms?.display.find(item => item.label == value)?.value ?? ""
                    }}
                        data={rooms.display}
                        className="col-span-3" />
                </div>

                {/*<div className="grid grid-cols-4 items-center gap-4">*/}
                {/*    <Label htmlFor="media" className="text-right">*/}
                {/*        Profile*/}
                {/*    </Label>*/}
                {/*    <Input id="media" value={snap.data.media} onChange={(e) => {*/}

                {/*        store.data.media = e.target.value*/}
                {/*    }}*/}
                {/*        className="col-span-3" />*/}
                {/*</div>*/}

            </div>
        </ModifyDialog>
    )
}
