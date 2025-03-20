import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Button } from "../ui/button";
import { cn } from "../../lib/utils";
import { ScrollArea } from "../ui/scroll-area";

export function ModifyDialog(props: {
    open: boolean,
    title: string,
    descriptions?: string,
    handleOnOpenChanged: (open: boolean) => void,
    handleSubmit: (event: any) => void,
    modal?: boolean,
    className?: string,
    children?: React.ReactNode,
}) {

    const { descriptions, modal, handleOnOpenChanged, handleSubmit, open, title, children, className } = props;


    return (
        <Dialog modal={modal} open={open} onOpenChange={handleOnOpenChanged}>
            <DialogContent className={cn("sm:max-w-[425px]", className)}>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>
                        {descriptions}
                    </DialogDescription>
                </DialogHeader>
                <ScrollArea className="max-h-[60dvh] pr-3">
                    {children}
                </ScrollArea>
                <DialogFooter>
                    <Button type="submit" onClick={handleSubmit}>Submit</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
