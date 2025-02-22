import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Button } from "../ui/button";

export function ModifyDialog(props: {
    open: boolean,
    title: string,
    descriptions?: string,
    handleOnOpenChanged: (open: boolean) => void,
    handleSubmit: (event: any) => void,
    children?: React.ReactNode,
}) {

    const { descriptions, handleOnOpenChanged, handleSubmit, open, title, children } = props;


    return (
        <Dialog open={open} onOpenChange={handleOnOpenChanged}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>
                        {descriptions}
                    </DialogDescription>
                </DialogHeader>
                {children}
                <DialogFooter>
                    <Button type="submit" onClick={handleSubmit}>Submit</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
