"use client"

import { useEffect } from "react"
import { classUserBatchCreateStore } from "../../stores/classUserStores"
import { ModifyDialog } from "../dialogs/ModifyDialog"
import { useSnapshot } from "valtio"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"


export function ClassUserBatchAddDialog({ isEdit }: {
    isEdit: boolean
}) {
    const store = classUserBatchCreateStore

    const snap = useSnapshot(store)

    //const [title, setTitle] = useState("")

    //useEffect(() => {
    //    setTitle(snap.isEdit ? "Edit" : "Create")
    //}, [snap.isEdit])

    const handleOpen = (open: boolean) => {
        store.opened = open
    }


    const handleSubmit = () => {
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
                Popup dialog to add and when it is done there a dialog to show which users is added
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