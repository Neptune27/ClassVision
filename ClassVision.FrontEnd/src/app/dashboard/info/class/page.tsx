import DbHeader from "@/components/dashboard/DbHeader";

export default function Page({ params }: {
    params: {
        id: string
    }
}) {


    return (
        <>
            <DbHeader items={[{ name: "Dashboard" }, { name: "Attending Class", url: "/dashboard/attending-class" }, { name: "Rollcall" }, { name: params.id }]} />
        </>
    )
}