"use client"
import svgStyle from "@/styles/svg.module.scss"
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "../../../components/ui/context-menu"
import { Popover, PopoverContent, PopoverTrigger } from "../../../components/ui/popover"
import { Label } from "@radix-ui/react-dropdown-menu"
import { Input } from "postcss"


export default function Page() {
    return (
        <>
            <div className={"container max-w-[500px]" }>
                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 1920 1080">
                    <image width="1920" height="1080" xlinkHref="/api/Media/test.png"></image>

                    <Popover>
                        <PopoverTrigger asChild>
                            <a onClick={() => {
                            }} >
                                <rect className={svgStyle.rectStroke} x="820" y="284" width="341" height="336"></rect>
                            </a>
                        </PopoverTrigger>
                        <PopoverContent className="w-80">
                            <div className="grid gap-4">
                                <div className="space-y-2">
                                    <h4 className="font-medium leading-none">Dimensions</h4>
                                    <p className="text-sm text-muted-foreground">
                                        Nijika.
                                    </p>
                                </div>
                            </div>
                        </PopoverContent>
                    </Popover>
                    <Popover>
                        <PopoverTrigger asChild>
                            <a onClick={() => {
                            }} >
                                <rect className={svgStyle.rectStroke} x="920" y="284" width="341" height="336"></rect>
                            </a>
                        </PopoverTrigger>
                        <PopoverContent className="w-80">
                            <div className="grid gap-4">
                                <div className="space-y-2">
                                    <h4 className="font-medium leading-none">Dimensions</h4>
                                    <p className="text-sm text-muted-foreground">
                                        Test.
                                    </p>
                                </div>
                            </div>
                        </PopoverContent>
                    </Popover>
                </svg>

            </div>
        </>

    )
}