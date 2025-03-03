import { proxy } from 'valtio'
import { EnrollmentModifyType } from '../interfaces/EnrollmentTypes'
import { ImageBasicInfomation, ImageFaceType } from '../interfaces/ImageFaceType'
import { StudentType } from '../interfaces/StudentTypes'
import { AttendeeType } from '../interfaces/AttendeeTypes'


export type RollcallStoreType = {
    userData: StudentType[],
    attentee: AttendeeType[],
    data: {
        image: ImageBasicInfomation,
        faces: ImageFaceType[]
    }[]
}

export const rollcallStore = proxy<RollcallStoreType>({
    userData: [],
    attentee: [],
    data: []
})
