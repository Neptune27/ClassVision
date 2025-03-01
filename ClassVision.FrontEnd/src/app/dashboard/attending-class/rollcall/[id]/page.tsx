import DbHeader from "@/components/dashboard/DbHeader";
import { RollCall } from "../../../../../components/attendingClass/RollCall";

export default function Page({ params}: {
    params: {
        id: string
    }
}) {


    return (
        <>
            <DbHeader items={[{ name: "Dashboard" }, { name: "Attending Class", url: "/dashboard/attending-class" }, { name: "Rollcall" }, { name: params.id }]} />
            <RollCall id={params.id} />
        </>
    )
}