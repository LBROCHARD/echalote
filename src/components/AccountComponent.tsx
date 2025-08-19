import { useAuth } from "@/providers/AuthContext";
import { Button } from "./ui/button";
import userIcon from '/User.png';
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
        <div className="flex items-start justify-start h-screen p-20">
            <Toaster/>
            <div className="items-start justify-start w-full">
                <div className="flex flex-row">
                    <img src={userIcon} alt={user?.username + " account"} className="bg-primary aspect-square h-20 rounded-2xl"/>
                    <div className="ml-5">
                        <p>{user?.username}</p>
                        <p>{user?.email}</p>
                    </div>
                </div>
                

                <hr className="mt-5"/>

                <Button onClick={onDisconnect} aria-description="Log the user out of your session.">
                    Disconnect
                </Button>
                
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