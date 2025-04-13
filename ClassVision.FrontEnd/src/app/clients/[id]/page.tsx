import { RollCall } from "../../../components/attendingClass/RollCall"



export default async function Page({ params }: {
    params: Promise<{
        id: string
    }>
}) {
    const { id } = await params;

    return (
        <>
            <RollCall id={id} isClient={true} />
        </>
    )
}