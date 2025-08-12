import { useAuth } from "@/providers/AuthContext";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Button } from "../ui/button";
import { toast, Toaster } from "sonner";
import { useGroupContext } from "@/providers/GroupContext";
import { useState } from "react";

interface DeletePageDialogProps {
    setParentDialogOpen: (isOpen: boolean) => void;
}

const DeletePageDialog = (props: DeletePageDialogProps) => {
    const {token} = useAuth();
    const {selectedGroup, selectedPage, rechargeGroupContent} = useGroupContext();
    const API = import.meta.env.VITE_REACT_APP_API_URL

    const [dialogOpen, setDialogOpen] = useState(false);

    const onDeletePage = async () => {
        try {
            if (selectedGroup == null || selectedPage == null) {
                throw new Error(`No Group or Pages selected`);
            }
            
            const response = await fetch(API + "/pages", {
                method: "delete",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    groupId: selectedGroup.id,
                    pageId: selectedPage.id
                }) 
            });

            if (!response.ok ) {
                if ([401, 403].indexOf(response.status) !== -1) {
                    throw new Error(`Response status text: ${response.status}`);
                }
            } else if (response.ok) {
                console.log("Page deleted ");
                toast("The Page was successfully deleted !");
                setDialogOpen(false);
                props.setParentDialogOpen(false);
                rechargeGroupContent();
            }
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error(error.message);
                toast("Error trying to delete a Page : " + error.message)
            }
        }
    }
    

    return (
        <>
            <Toaster/>
            <Dialog open={dialogOpen}>
                <DialogTrigger className="m-0">

                    <Button type="button" className="bg-red-500 text-white cursor-pointer" onClick={() => setDialogOpen(true)}>
                        Delete Page
                    </Button>

                </DialogTrigger>

                <DialogContent showCloseButton={false}>
                    <DialogHeader>
                        <DialogTitle>Are you shure you want to delete this page ?</DialogTitle>
                        <DialogDescription>This action cannot be undone !</DialogDescription>
                    </DialogHeader>
                        
                        <DialogFooter>
                            <Button type="button" onClick={() => setDialogOpen(false)}>Cancel</Button>
                            <Button onClick={onDeletePage} className="bg-red-500 text-white cursor-pointer">Delete</Button>
                        </DialogFooter>
                            
                </DialogContent>
            </Dialog>
        </>
    );
}


export default DeletePageDialog;