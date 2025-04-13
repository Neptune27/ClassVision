import DbHeader from "@/components/dashboard/DbHeader";
import { RollCall } from "../../../../../components/attendingClass/RollCall";

export default async function Page({ params}: {
    params: Promise<{
        id: string
    }>
}) {


    const { id } = await params

    return (
        <>
            <DbHeader items={[{ name: "Dashboard" }, { name: "Attending Class", url: "/dashboard/attending-class" }, { name: "Rollcall" }, { name: id }]} />
            <RollCall id={id} />
        </>
    )
}