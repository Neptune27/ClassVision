import { proxy } from 'valtio'
import { EnrollmentModifyType } from '../interfaces/EnrollmentTypes'
import { ImageBasicInfomation, ImageFaceType } from '../interfaces/ImageFaceType'
import { StudentType } from '../interfaces/StudentTypes'


export type RollcallStoreType = {
    userData: StudentType[],
    data: {
        image: ImageBasicInfomation,
        faces: ImageFaceType[]
    }[]
}

export const rollcallStore = proxy<RollcallStoreType>({
    userData: [],
    data: []
})
