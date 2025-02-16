import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import React from "react"

interface ImageProps {
    imagesource: string
}

export interface CardWithImageProps
    extends React.ButtonHTMLAttributes<HTMLDivElement>, ImageProps { }

const CardWithImage = React.forwardRef<HTMLDivElement, CardWithImageProps>((props, ref) => (
    <div ref={ref} className={cn("flex flex-col gap-6", props.className)} {...props}>
        <Card className="overflow-hidden" >
            <CardContent className="grid p-0 md:grid-cols-2" >
                {props.children}
                < div className="relative hidden bg-muted md:block" >
                    <img
                        src={props.imagesource}
                        alt="Card cover"
                        className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
                    />
                </div>
            </CardContent>
        </Card>
    </div>))

export default CardWithImage;
//const CardWithImage = React.forwardRef<HTMLDivElement, CardWithImageProps> ({
//    className,

//    ...props
//}) => {
//(

//    )
//}