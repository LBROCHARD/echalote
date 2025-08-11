import { useAuth } from "@/providers/AuthContext";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Button } from "../ui/button";
import { toast, Toaster } from "sonner";
import { useNavigate } from "react-router-dom";
import { useGroupContext } from "@/providers/GroupContext";


const DeletePageDialog = () => {
    const {token} = useAuth();
    const {selectedGroup, selectedPage} = useGroupContext();
    const API = import.meta.env.VITE_REACT_APP_API_URL
    const navigate = useNavigate();

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
                navigate(0); // refresh the page
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
            <Dialog>
                <DialogTrigger className="m-0">

                    <Button  className="bg-red-500 text-white cursor-pointer">
                        Delete Page
                    </Button>

                </DialogTrigger>

                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Are you shure you want to delete this page ?</DialogTitle>
                        <DialogDescription>This action cannot be undone !</DialogDescription>
                    </DialogHeader>
                        
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button>Cancel</Button>
                            </DialogClose>
                            <Button onClick={onDeletePage} className="bg-red-500 text-white cursor-pointer">Delete</Button>
                        </DialogFooter>
                            
                </DialogContent>
            </Dialog>
        </>
    );
}


export default DeletePageDialog;