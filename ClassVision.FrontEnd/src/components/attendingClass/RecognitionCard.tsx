import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@radix-ui/react-collapsible"
import { ChevronDown } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { Button } from "../ui/button"
import React from "react"
import { EFaceStatus, ImageFaceExampleData, ImageFaceType } from "../../interfaces/ImageFaceType"
import svgStyle from "@/styles/svg.module.scss"
import { FaceStudentPopoverContent } from "./FaceStudentPopoverContent"
import { rollcallStore } from "../../stores/rollcallStores"
import { useSnapshot } from "valtio"

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

export function RecognitionCard(props: {

}) {
    const { } = props

    const [isOpen, setIsOpen] = React.useState(true)
    const [data, setData] = React.useState<ImageFaceType[]>(ImageFaceExampleData)
    const store = rollcallStore;
    const snap = useSnapshot(store)

    return (
        <Card className="w-full">
            <Collapsible open={isOpen} onOpenChange={setIsOpen}>
                <div className="relative">
                    <CardHeader className="pb-2">
                        <CardTitle>Image</CardTitle>
                        <CardDescription>A.</CardDescription>
                    </CardHeader>
                    <CollapsibleTrigger className="absolute right-4 top-4 rounded-full p-1 hover:bg-muted">
                        <ChevronDown className={`h-5 w-5 transition-transform ${isOpen ? "" : "-rotate-90"}`} />
                    </CollapsibleTrigger>
                </div>
                <CollapsibleContent>
                    <CardContent>
                        {snap.data.map((d, index) =>
                            <svg key={ index} version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox={`0 0 ${d.image.width} ${d.image.height}`}>
                                <image width={d.image.width} height={d.image.height} xlinkHref={d.image.url}></image>
                            {d.faces.map((e, i) => {
                                return (
                                    <Popover key={i}>
                                        <PopoverTrigger asChild>
                                            <a onClick={() => {
                                            }} >
                                                <rect className={boundingBoxClassHandler(e.status)} x={e.data.x} y={e.data.y} width={(e.data.w - e.data.x)} height={e.data.h - e.data.y}></rect>
                                            </a>
                                        </PopoverTrigger>
                                        <PopoverContent className="p-0">
                                            <FaceStudentPopoverContent id={e.id.toString()} imagePosition={index} />
                                        </PopoverContent>
                                    </Popover>
                                )
                            })}
                        </svg>)
                        }

                    </CardContent>
                    <CardFooter className="flex justify-between">
                        <Button variant="outline">Cancel</Button>
                        <Button>Deploy</Button>
                    </CardFooter>
                </CollapsibleContent>
            </Collapsible>
        </Card>
    )
}