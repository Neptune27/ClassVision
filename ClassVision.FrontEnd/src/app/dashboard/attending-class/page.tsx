import DbHeader from "@/components/dashboard/DbHeader";
import { ClassCard } from "../../../components/attendingClass/ClassCard";

export default function Page() {

    return (
        <>
            <DbHeader items={[{ name: "Dashboard" }, { name: "Attending Class" }]} />
            <div className="container mx-auto p-10">
                <h1 className="text-bold text-xl pb-4">Classes:</h1>
                <ClassCard />
            </div>

        </>
    )
}