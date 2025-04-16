import DbHeader from "@/components/dashboard/DbHeader";
import { AddAuthorizedStudentPage } from "../../../../components/infos/class/AddAuthorizedStudentPage";

export default async function Page({ params }: {
    params: Promise<{
        classId: string
    }>
}) {


    const { classId } = await params

    return (
        <>
            <DbHeader items={[{ name: "Dashboard" }, { name: "Join class" }, { name: classId }]} />
            <AddAuthorizedStudentPage classId={classId} />            

        </>
    )
}