import { useAuth } from "@/providers/AuthContext";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Button } from "../ui/button";
import { toast, Toaster } from "sonner";
import { useNavigate } from "react-router-dom";
import { useGroupContext } from "@/providers/GroupContext";


const DeleteGroupDialog = () => {
    const {token} = useAuth();
    const {selectedGroup} = useGroupContext();
    const API = import.meta.env.VITE_REACT_APP_API_URL
    const navigate = useNavigate();

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
                navigate(0); // refresh the page
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
            <Dialog>
                <DialogTrigger className="m-0">

                    <Button  className="bg-red-500 text-white cursor-pointer">
                        Delete Group
                    </Button>

                </DialogTrigger>

                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Are you shure you want to delete this group ?</DialogTitle>
                    </DialogHeader>
                        
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button>Cancel</Button>
                            </DialogClose>
                            <Button onClick={onDeleteGroup} className="bg-red-500 text-white cursor-pointer">Delete</Button>
                        </DialogFooter>
                            
                </DialogContent>
            </Dialog>
        </>
    );
}


export default DeleteGroupDialog;