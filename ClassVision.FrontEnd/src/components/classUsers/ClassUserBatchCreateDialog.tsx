"use client"

import { useEffect } from "react"
import { classUserBatchCreateStore } from "../../stores/classUserStores"
import { ModifyDialog } from "../dialogs/ModifyDialog"
import { useSnapshot } from "valtio"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { toast } from "sonner"
import { authorizedFetch } from "../../utils/authorizedFetcher"
import { ClassUserType } from "../../interfaces/ClassUserTypes"
import { ManualClassUserAdd } from "./ManualClassUserAdd"


export function ClassUserBatchAddDialog({
    isEdit,
    classId
}: {
        isEdit: boolean,
        classId: string
}) {
    const store = classUserBatchCreateStore
    const snap = useSnapshot(store)

    //const [title, setTitle] = useState("")

    //useEffect(() => {
    //    setTitle(snap.isEdit ? "Edit" : "Create")
    //}, [snap.isEdit])


    const handleCreateStudent = async (firstName: string, lastName: string) => {
        const resp = await authorizedFetch(`/api/Student`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                firstName: firstName,
                lastName: lastName,
                id: "err"
            })
        })

        if (!resp.ok) {
            toast("Error fetching course data")
        }

        const student = await resp.json();
        return student as ClassUserType
    }

    const handleJoinClass = async (classId: string, studentId: string) => {
        const resp = await authorizedFetch(`/api/Enrollment`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                studentId: studentId,
                courseId: classId
            })
        })

        if (!resp.ok) {
            toast("Error fetching course data")
        }

    }

    const handleAddStudents = async () => {

        for (const student of store.manualUsers) {

            const createdStudent = await handleCreateStudent(student.firstName, student.lastName);
            console.log(createdStudent)

            if (classId == null) {
                toast("Class id not found?")
                return
            }

            await handleJoinClass(classId, createdStudent.id)

            //setIsComplete(true)
        }


    }

    const handleOpen = (open: boolean) => {
        store.opened = open
    }


    const handleSubmit = () => {
        handleAddStudents()
        store.opened = false;
    }

    return (
        <ModifyDialog open={snap.opened} handleOnOpenChanged={handleOpen}
            title={"Add students"} handleSubmit={handleSubmit}>
            <Tabs defaultValue="qr" className="w-full p-4">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="manual">Manual</TabsTrigger>
                    <TabsTrigger value="qr">By QR</TabsTrigger>
                    <TabsTrigger value="excel">By Excel</TabsTrigger>
                </TabsList>
                <TabsContent value="manual">
                    <ManualClassUserAdd />
                </TabsContent>
                <TabsContent value="qr">
                    <div dangerouslySetInnerHTML={{ __html: snap.qr }} />
                </TabsContent>
                <TabsContent value="excel">
                </TabsContent>
            </Tabs>

        </ModifyDialog>
    )
}