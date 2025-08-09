import { useAuth } from "@/providers/AuthContext";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Button } from "../ui/button";
import { toast, Toaster } from "sonner";
import { useNavigate } from "react-router-dom";
import { DialogDescription } from "@radix-ui/react-dialog";
import { X } from "lucide-react";

interface DeleteMemberDialogProps {
    username: string;
    groupID?: string;
}

const DeleteMemberDialog = (props: DeleteMemberDialogProps) => {
    const {token} = useAuth();
    const API = import.meta.env.VITE_REACT_APP_API_URL
    const navigate = useNavigate();

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
            navigate(0); // refresh the page

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
            <Dialog>
                <DialogTrigger className="m-0">

                    <Button 
                        className="m-0 ml-2 p-0 pl-1 pr-1 bg-transparent hover:bg-transparent text-red-500 hover:text-red-800 shadow-none cursor-pointer"
                    >
                        <X/>
                    </Button>

                </DialogTrigger>

                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Are you shure you want to remove this user from this group ?</DialogTitle>
                        <DialogDescription>This action cannot be undone !</DialogDescription>
                    </DialogHeader>
                        
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button>Cancel</Button>
                            </DialogClose>
                            <Button onClick={onDeleteMember} className="bg-red-500 text-white cursor-pointer">Remove Member</Button>
                        </DialogFooter>
                            
                </DialogContent>
            </Dialog>
        </>
    );
}


export default DeleteMemberDialog;