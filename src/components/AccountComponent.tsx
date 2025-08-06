import { useAuth } from "@/providers/AuthContext";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { DialogClose } from "@radix-ui/react-dialog";
import { toast, Toaster } from "sonner";

const AccountComponent = () => {
    const {token, user, logout} = useAuth();
    const API = import.meta.env.VITE_REACT_APP_API_URL

    const onDisconnect = () => {
        logout();
    }

    const onDelete = async () => {
        try {
            const response = await fetch(API + "/auth/delete/" + user?.id, {
                method: "delete",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok ) {
                if ([401, 403].indexOf(response.status) !== -1) {
                    toast("You do not have the right to delete this user.");
                    return
                }
                throw new Error(`Response status text: ${response.status}`);
            }

            const json = await response.json();
            console.log("result : ", json);
            logout();
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error(error.message);
                toast("Error trying to login: " + error.message)
            }
        }
    }

    return (
        <div className="flex items-center justify-center h-screen">
            <Toaster/>
            <div className="items-center justify-center">
                <p>Username : {user?.username} </p>
                <p>Email : {user?.email} </p>
                <Button onClick={onDisconnect}>Disconnect</Button>
                
                <Dialog>
                    <DialogTrigger>
                        <Button className="bg-red-600 hover:bg-red-400 text-white">Delete account</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Are you sure you want to delete your account ?</DialogTitle>
                            <DialogDescription>
                                This action is permanant, and cannot be undone.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant="secondary">Close</Button>
                            </DialogClose>
                            <Button onClick={onDelete}>Confirm</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
}


export default AccountComponent;