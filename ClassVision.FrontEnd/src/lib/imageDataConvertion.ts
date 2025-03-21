import { ImageFaceType } from "../interfaces/ImageFaceType"

export const imageDataConvert = (data: any) => {
    return ({
        path: data.path,
        faces: data.faces.map(f => {
            return {
                "id": f.id,
                "status": f.studentId != null ? 1 : 0,
                //"status": f.status,
                "data": {
                    "x": f.x,
                    "y": f.y,
                    "w": f.w,
                    "h": f.h
                },
                "user_id": f.studentId

            }
        })
    })
}