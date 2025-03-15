import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@radix-ui/react-collapsible"
import { ChevronDown} from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { Button } from "../ui/button"
import React, { useState } from "react"
import { EFaceStatus, ImageFaceExampleData, ImageFaceType } from "../../interfaces/ImageFaceType"
import { FaceStudentPopoverContent } from "./FaceStudentPopoverContent"
import { rollCallStore } from "../../stores/rollcallStores"
import { useSnapshot } from "valtio"
import { Carousel, CarouselApi, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../ui/carousel"

import svgStyle from "@/styles/svg.module.scss"


// Import React FilePond
import { FilePond, registerPlugin } from 'react-filepond';

// Import FilePond styles
import 'filepond/dist/filepond.min.css';
import { FilePondInitialFile } from "filepond"
import { authorizedFetch } from "../../utils/authorizedFetcher"
import { RollcallImage } from "./RollCallImage"
import { toSvgString } from "../../lib/qrUltis"
import { QrCode, QrCodeEcc } from "../../lib/qrcodegen"


const imageUrl = "/api/RollCallImage"

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
    scheduleId: string
}) {
    const { scheduleId } = props
    const [carouselApi, setCarouselApi] = React.useState<CarouselApi>()
    const [isOpen, setIsOpen] = React.useState(true)

    const [svg, setSvg] = useState("")
    const store = rollCallStore;
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
                        <Carousel className="w-[90%] mx-auto" setApi={setCarouselApi}>
                            <CarouselContent>
                                {snap.data.map((d, index) =>
                                    <CarouselItem key={index}>
                                        <RollcallImage imageUrl={d.path} faces={d.faces} position={index} />
                                    </CarouselItem>
                                    )
                                }
                                {svg != "" &&
                                    <CarouselItem>
                                        <div dangerouslySetInnerHTML={{__html: svg}} />
                                    </CarouselItem>
                                }

                                <CarouselItem>
                                    <FilePond onprocessfile={(e, file) => {
                                        console.log(e)
                                        console.log(file)
                                        if (e) {
                                            return
                                        }

                                        store.data.push({
                                            faces: [],
                                            path: file.serverId,
                                        })
                                    }} id="file" className="h-full" onremovefile={async (e, f) => {
                                        if (e) {
                                            console.log("Wtf")
                                            console.log(e)
                                            return
                                        }
                                        const id = f.serverId
                                        await authorizedFetch(`/api/RollCallImage?path=${id}`, {
                                            method: "DELETE"
                                        })


                                        }} allowMultiple={true} maxFiles={10} server={`${imageUrl}/${scheduleId}`} />
                                </CarouselItem>
                                
                            </CarouselContent>
                            <CarouselPrevious />
                            <CarouselNext />
                        </Carousel>


                    </CardContent>
                    <CardFooter className="flex justify-between">
                        <Button variant="destructive" onClick={async () => {
                            const index = carouselApi?.selectedScrollSnap()
                            if (index === undefined) {
                                return
                            }

                            const id = store.data[index].path
                            const resp = await authorizedFetch(`/api/RollCallImage?path=${id}`, {
                                method: "DELETE"
                            })

                            if (resp.ok) {
                                store.data.splice(index, 1)
                            }
                        }}>Delete</Button>

                        <div>
                            <Button variant="secondary" onClick={() => {

                                // Name abbreviated for the sake of these examples here
                                //const QRC = qrcodegen.QrCode;

                                // Simple operation
                                const qr0 = QrCode.encodeText(`${location.href}`, QrCodeEcc.MEDIUM);
                                const svg = toSvgString(qr0, 4, "#FFFFFF", "#000000");  // See qrcodegen-input-demo
                                setSvg(svg)

                            }}>Share</Button>
                            <Button onClick={() => {

                            }}>Submit</Button>
                        </div>

                    </CardFooter>
                </CollapsibleContent>
            </Collapsible>
        </Card>
    )
}