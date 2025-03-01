"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronDown } from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import React, { useEffect } from "react"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"

import svgStyle from "@/styles/svg.module.scss"


const dataSample = [
    {
        "id": 0,
        "isSelected": false,
        "data": [
            "392",
            "253",
            "410",
            "274"
        ]
    },
    {
        "id": 1,
        "isSelected": false,
        "data": [
            "260",
            "264",
            "277",
            "285"
        ]
    },
    {
        "id": 2,
        "isSelected": false,
        "data": [
            "340",
            "252",
            "359",
            "275"
        ]
    },
    {
        "id": 3,
        "isSelected": false,
        "data": [
            "177",
            "255",
            "195",
            "277"
        ]
    },
    {
        "id": 4,
        "isSelected": false,
        "data": [
            "610",
            "264",
            "630",
            "287"
        ]
    },
    {
        "id": 5,
        "isSelected": false,
        "data": [
            "305",
            "256",
            "321",
            "276"
        ]
    },
    {
        "id": 6,
        "isSelected": false,
        "data": [
            "566",
            "259",
            "584",
            "282"
        ]
    },
    {
        "id": 7,
        "isSelected": false,
        "data": [
            "324",
            "148",
            "335",
            "163"
        ]
    },
    {
        "id": 8,
        "isSelected": false,
        "data": [
            "92",
            "259",
            "109",
            "278"
        ]
    },
    {
        "id": 9,
        "isSelected": false,
        "data": [
            "496",
            "196",
            "509",
            "212"
        ]
    },
    {
        "id": 10,
        "isSelected": false,
        "data": [
            "220",
            "260",
            "238",
            "280"
        ]
    },
    {
        "id": 11,
        "isSelected": false,
        "data": [
            "436",
            "256",
            "454",
            "278"
        ]
    },
    {
        "id": 12,
        "isSelected": false,
        "data": [
            "290",
            "150",
            "302",
            "165"
        ]
    },
    {
        "id": 13,
        "isSelected": false,
        "data": [
            "42",
            "253",
            "63",
            "275"
        ]
    },
    {
        "id": 14,
        "isSelected": false,
        "data": [
            "522",
            "260",
            "540",
            "283"
        ]
    },
    {
        "id": 15,
        "isSelected": false,
        "data": [
            "124",
            "258",
            "143",
            "280"
        ]
    },
    {
        "id": 16,
        "isSelected": false,
        "data": [
            "421",
            "150",
            "432",
            "165"
        ]
    },
    {
        "id": 17,
        "isSelected": false,
        "data": [
            "443",
            "197",
            "456",
            "212"
        ]
    },
    {
        "id": 18,
        "isSelected": false,
        "data": [
            "528",
            "193",
            "540",
            "209"
        ]
    },
    {
        "id": 19,
        "isSelected": false,
        "data": [
            "412",
            "198",
            "424",
            "215"
        ]
    },
    {
        "id": 20,
        "isSelected": false,
        "data": [
            "344",
            "199",
            "357",
            "216"
        ]
    },
    {
        "id": 21,
        "isSelected": false,
        "data": [
            "307",
            "197",
            "320",
            "214"
        ]
    },
    {
        "id": 22,
        "isSelected": false,
        "data": [
            "452",
            "149",
            "463",
            "163"
        ]
    },
    {
        "id": 23,
        "isSelected": false,
        "data": [
            "387",
            "148",
            "398",
            "162"
        ]
    },
    {
        "id": 24,
        "isSelected": false,
        "data": [
            "354",
            "149",
            "365",
            "163"
        ]
    },
    {
        "id": 25,
        "isSelected": false,
        "data": [
            "260",
            "147",
            "273",
            "162"
        ]
    },
    {
        "id": 26,
        "isSelected": false,
        "data": [
            "479",
            "259",
            "497",
            "280"
        ]
    },
    {
        "id": 27,
        "isSelected": false,
        "data": [
            "268",
            "193",
            "282",
            "211"
        ]
    },
    {
        "id": 28,
        "isSelected": false,
        "data": [
            "200",
            "199",
            "212",
            "214"
        ]
    },
    {
        "id": 29,
        "isSelected": false,
        "data": [
            "475",
            "206",
            "489",
            "223"
        ]
    },
    {
        "id": 30,
        "isSelected": false,
        "data": [
            "482",
            "148",
            "495",
            "163"
        ]
    },
    {
        "id": 31,
        "isSelected": false,
        "data": [
            "370",
            "126",
            "381",
            "140"
        ]
    },
    {
        "id": 32,
        "isSelected": false,
        "data": [
            "230",
            "197",
            "243",
            "211"
        ]
    },
    {
        "id": 33,
        "isSelected": false,
        "data": [
            "227",
            "142",
            "240",
            "157"
        ]
    },
    {
        "id": 34,
        "isSelected": false,
        "data": [
            "303",
            "122",
            "314",
            "135"
        ]
    },
    {
        "id": 35,
        "isSelected": false,
        "data": [
            "380",
            "204",
            "393",
            "219"
        ]
    },
    {
        "id": 36,
        "isSelected": false,
        "data": [
            "340",
            "130",
            "351",
            "143"
        ]
    },
    {
        "id": 37,
        "isSelected": false,
        "data": [
            "168",
            "198",
            "179",
            "212"
        ]
    },
    {
        "id": 38,
        "isSelected": false,
        "data": [
            ""
        ]
    }
]

function getRandomInt(max: number) {
    return Math.floor(Math.random() * max);
}

export function TestImageCard() {
    const [isOpen, setIsOpen] = React.useState(true)
    const [data, setData] = React.useState(dataSample)

    useEffect(() => {
        const size = data.length
        setInterval(() => {
            const randNumber = getRandomInt(size)

            data[randNumber].isSelected = true
            setData([...data])
        }, 1000)
    }, [])

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
                        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 680 453">
                            <image width="680" height="453" xlinkHref="/api/Media/lop6.jpg"></image>
                            {data.map((e, i) => {
                                return (
                                    <Popover key={i }>
                                        <PopoverTrigger asChild>
                                            <a onClick={() => {
                                            }} >
                                                <rect className={e.isSelected ? svgStyle.rectStrokeGreen : svgStyle.rectStrokeRed} x={e.data[0]} y={e.data[1]} width={(e.data[2] - e.data[0])} height={e.data[3] - e.data[1]}></rect>
                                            </a>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-80">
                                            <div className="grid gap-4">
                                                <div className="space-y-2">
                                                    <h4 className="font-medium leading-none">Item {i}</h4>
                                                    <p className="text-sm text-muted-foreground">
                                                        Test {i}
                                                    </p>
                                                </div>
                                            </div>
                                        </PopoverContent>
                                    </Popover>
                                )
                            }) }


                        </svg>

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

