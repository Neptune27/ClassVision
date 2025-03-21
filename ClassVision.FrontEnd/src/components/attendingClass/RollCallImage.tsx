"use client"

import { useEffect, useState } from "react"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { FaceStudentPopoverContent } from "./FaceStudentPopoverContent"
import { EFaceStatus, ImageFaceType } from "../../interfaces/ImageFaceType"

import svgStyle from "@/styles/svg.module.scss"
import { getImageDimensions } from "../../lib/utils"
import { rollCallHubStore } from "../../stores/rollcallStores"


const hubStore = rollCallHubStore;


const boundingBoxClassHandler = (status: EFaceStatus) => {
    switch (status) {
        case EFaceStatus.NOT_SELECTED:
            return svgStyle.rectStrokeRed
        case EFaceStatus.SELECTED:
            return svgStyle.rectStrokeGreen
        case EFaceStatus.REMOVED:
            return svgStyle.rectStrokeBlack

    }
}

export function RollcallImage({ imageUrl, faces, position }: {
    imageUrl: string,
    faces: ImageFaceType[],
    position: number
}) {
    const [dimension, setDimension] = useState<{
        w: number,
        h: number
    }>({
        w: 0,
        h: 0
    })


    useEffect(() => {
        const getDimension = async() => {
            const dimensions = await getImageDimensions(imageUrl)
            setDimension({ h: dimensions.height, w: dimensions.width })
        }

        getDimension()
    }, [])

    return (
        <>
            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox={`0 0 ${dimension.w} ${dimension.h}`}>
                <image width={dimension.w} height={dimension.h} xlinkHref={imageUrl}></image>
                {faces.map((e, i) => {
                    return (
                        <Popover key={i}>
                            <PopoverTrigger asChild>
                                <a>
                                    {e.user_id && <text x={e.data.x} y={e.data.y} fill="green">{e.user_id}</text>}
                                    <rect className={boundingBoxClassHandler(e.status)} x={e.data.x} y={e.data.y} width={(e.data.w - e.data.x)} height={e.data.h - e.data.y}></rect>
                                </a>
                            </PopoverTrigger>
                            <PopoverContent className="p-0">
                                <FaceStudentPopoverContent id={e.id.toString()} imagePosition={position} />
                            </PopoverContent>
                        </Popover>
                    )
                })}
            </svg>
        </>

    )
}