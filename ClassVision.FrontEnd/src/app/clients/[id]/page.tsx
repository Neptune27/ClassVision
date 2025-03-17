import { RollCall } from "../../../components/attendingClass/RollCall"

export default function Page({ params }: {
    params: {
        id: string
    }
}) {


    return (
        <>
            <RollCall id={params.id} isClient={true} />
        </>
    )
}