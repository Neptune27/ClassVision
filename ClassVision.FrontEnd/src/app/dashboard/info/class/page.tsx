import DbHeader from "@/components/dashboard/DbHeader";
import { ClassContent } from "../../../../components/infos/class/ClassContent";

export default function Page() {


    return (
        <>
            <DbHeader items={[{ name: "Dashboard" }, { name: "Info", url: "/dashboard/info" }, { name: "Class", url: "/dashboard/info/class" }]} />
            <ClassContent />
        </>
    )
}