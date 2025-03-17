import DbHeader from "@/components/dashboard/DbHeader";
import { ClassDetailsTable } from "../../../../../components/infos/classDetails/ClassDetailsTable";

export default function Page({ params }: {
    params: {
        id: string
    }
}) {


    return (
        <>
            <DbHeader items={[{ name: "Dashboard" }, { name: "Info", url: "/dashboard/info" }, { name: "Class", url: "/dashboard/info/class" }, { name: params.id }]} />
            <ClassDetailsTable classId={params.id} >

            </ClassDetailsTable>
        </>
    )
}