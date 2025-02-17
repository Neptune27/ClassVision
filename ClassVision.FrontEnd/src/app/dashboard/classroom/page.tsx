import ClassroomTable from "../../../components/classroom/ClassroomTable"
import DbHeader from "../../../components/dashboard/DbHeader"

const ClassroomPage = () => {
    return (
        <>
            <DbHeader items={[{ name: "Dashboard" }, { name: "Classroom" }]} />
            <ClassroomTable/>
        </>
    )
}

export default ClassroomPage