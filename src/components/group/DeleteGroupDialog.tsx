import { useAuth } from "@/providers/AuthContext";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Button } from "../ui/button";
import { toast, Toaster } from "sonner";
import { useGroupContext } from "@/providers/GroupContext";
import { useState } from "react";

interface DeleteGroupDialogProps {
    setParentDialogOpen: (isOpen: boolean) => void;
}

const DeleteGroupDialog = (props: DeleteGroupDialogProps) => {
    const {token} = useAuth();
    const {selectedGroup, rechargeUserGroups} = useGroupContext();
    const API = import.meta.env.VITE_REACT_APP_API_URL

    const [dialogOpen, setDialogOpen] = useState(false);

    const onDeleteGroup = async () => {
        try {
            if (selectedGroup == null) {
                throw new Error(`No group selected`);
            }
            
            const response = await fetch(API + "/group", {
                method: "delete",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    groupID: selectedGroup.id
                }) 
            });

            if (!response.ok ) {
                if ([401, 403].indexOf(response.status) !== -1) {
                    throw new Error(`Response status text: ${response.status}`);
                }
            } else if (response.ok) {
                console.log("group deleted ");
                toast("The group was successfully deleted !");
                setDialogOpen(false);
                props.setParentDialogOpen(false);
                rechargeUserGroups();

            }
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error(error.message);
                toast("Error trying to delete a group : " + error.message)
            }
        }
    }
    

    return (
        <>
            <Toaster/>
            <Dialog open={dialogOpen}>
                <DialogTrigger className="m-0">

                    <Button type="button" className="bg-red-500 text-white cursor-pointer" onClick={() => setDialogOpen(true)}>
                        Delete Group
                    </Button>

                </DialogTrigger>

                <DialogContent showCloseButton={false}>
                    <DialogHeader>
                        <DialogTitle>Are you shure you want to delete this group ?</DialogTitle>
                        <DialogDescription>This action cannot be undone !</DialogDescription>
                    </DialogHeader>
                        
                        <DialogFooter>
                            <Button type="button" onClick={() => setDialogOpen(false)}>Cancel</Button>
                            <Button onClick={onDeleteGroup} className="bg-red-500 text-white cursor-pointer">Delete</Button>
                        </DialogFooter>
                            
                </DialogContent>
            </Dialog>
        </>
    );
}


export default DeleteGroupDialog;