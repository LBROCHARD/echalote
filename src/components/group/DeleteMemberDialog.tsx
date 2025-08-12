import { useAuth } from "@/providers/AuthContext";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Button } from "../ui/button";
import { toast, Toaster } from "sonner";
import { DialogDescription } from "@radix-ui/react-dialog";
import { SidebarMenuButton, SidebarMenuItem } from "../ui/sidebar";
import { useState } from "react";
import { useGroupContext } from "@/providers/GroupContext";

interface DeleteMemberDialogProps {
    username: string;
    groupID?: string;
}

const DeleteMemberDialog = (props: DeleteMemberDialogProps) => {
    const {token} = useAuth();
    const API = import.meta.env.VITE_REACT_APP_API_URL
    const {rechargeGroupContent} = useGroupContext();

    const [dialogOpen, setDialogOpen] = useState(false);

    const onDeleteMember = async () => {
        try {
            if (props.groupID == null ) {
                throw new Error(`No group selected`);
            }

            const response = await fetch(API + "/group/member", {
                method: "delete",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    groupID: props.groupID,
                    username: props.username,
                }) 
            });

            if (!response.ok ) {
                if ([401, 403].indexOf(response.status) !== -1) {
                    throw new Error("You don't have the rights to remove this user to the group !");
                } else if ([404].indexOf(response.status) !== -1) {
                    throw new Error("This user does not exist !");
                }
                throw new Error(`Response status text: ${response.status}`);
            }
            const json = await response.json();
            console.log("result : ", json);
            toast("User " + props.username + " was successfully removed from the group !");
            setDialogOpen(false);
            rechargeGroupContent(); 


        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error(error.message);
                toast("Error trying to add member to the group : " + error.message)
            }
        }
    }
    

    return (
        <>
            <Toaster/>
            <Dialog open={dialogOpen}>
                <SidebarMenuItem key={props.groupID} className="list-none m-0 p-0 mb-0">
                    <SidebarMenuButton className="m-0 p-0">
                        <DialogTrigger 
                            className="m-0 flex justify-start items-center bg-transparent hover:bg-transparent w-full h-full" 
                            onClick={() => setDialogOpen(true)}
                        >
                            <p className="ml-2">{"•  " + props.username}</p>
                        </DialogTrigger>
                    </SidebarMenuButton>
                </SidebarMenuItem>

                <DialogContent showCloseButton={false}>
                    <DialogHeader>
                        <DialogTitle>Are you shure you want to remove this user from this group ?</DialogTitle>
                        <DialogDescription>This action cannot be undone !</DialogDescription>
                    </DialogHeader>
                        
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button type="button" onClick={() => setDialogOpen(false)}>Cancel</Button>
                            </DialogClose>
                            <Button onClick={onDeleteMember} className="bg-red-500 text-white cursor-pointer">Remove Member</Button>
                        </DialogFooter>
                            
                </DialogContent>
            </Dialog>
        </>
    );
}


export default DeleteMemberDialog;