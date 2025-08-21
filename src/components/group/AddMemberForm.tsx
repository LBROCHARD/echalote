import { useAuth } from "@/providers/AuthContext";
import z from "zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { SidebarMenuButton, SidebarMenuItem } from "../ui/sidebar";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useGroupContext } from "@/providers/GroupContext";

const formSchema = z.object({
    username: z.string()
        .min(1, {message: "Please enter at least one characters"})
})


const AddMemberForm = () => {
    const {token} = useAuth();
    const {selectedGroup, rechargeGroupContent} = useGroupContext();
    const API = import.meta.env.VITE_REACT_APP_API_URL
    
    const [fetchError, setFetchError] = useState("");
    const [dialogOpen, setDialogOpen] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "Username",
        },
    })

    const onSubmitCreate = async (values: z.infer<typeof formSchema>) => {
        setFetchError(""); // this is used to show the error reloads when trying again
        
        try {
            if (selectedGroup == null ) {
                throw new Error(`No group selected`);
            }

            const response = await fetch(API + "/group/member", {
                method: "post",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    groupID: selectedGroup.id,
                    username: values.username,
                }) 
            });

            if (!response.ok ) {
                if ([401, 403].indexOf(response.status) !== -1) {
                    setFetchError("You don't have the rights to add this user to the group !");
                } else if ([404].indexOf(response.status) !== -1) {
                    setFetchError("This user does not exist !");
                }
                throw new Error(`Response status text: ${response.status}`);
            }
            const json = await response.json();
            console.log("result : ", json);
            toast("User " + values.username + " was successfully added to the group !");
            setDialogOpen(false);
            rechargeGroupContent();

        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error(error.message);
                // setFetchError("Error trying to add member to the group : " + error.message)
                toast("Error trying to add member to the group : " + error.message)
            }
        }
    }
    

    return (
        <>
            <Dialog open={dialogOpen}>
                <DialogTrigger>
                    <SidebarMenuItem className="list-none m-0">
                        <SidebarMenuButton asChild className="cursor-pointer m-0" onClick={() => setDialogOpen(true)}>
                            <p className="text-muted-foreground"> + Add a new member</p>
                        </SidebarMenuButton>
                    </SidebarMenuItem>

                </DialogTrigger>

                <DialogContent showCloseButton={false}>
                    <DialogHeader>
                        <DialogTitle>Add a new member to your group !</DialogTitle>
                    </DialogHeader>

                    <Form {...form}>
                        <form onSubmit= {form.handleSubmit(onSubmitCreate)} className="space-y-8">
                            <FormField
                                control={form.control}
                                name="username"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Username</FormLabel>
                                            <FormControl>
                                                <Input {...field} />
                                            </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <p className="text-red-600">{fetchError}</p>
                            <DialogFooter>
                                <Button type="button" className="cursor-pointer ml-0" onClick={() => setDialogOpen(false)}>
                                    Cancel
                                </Button>
                                <Button type="submit" variant={"secondary"} className="cursor-pointer ml-0">
                                    Add Member
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form> 
                </DialogContent>
                
            </Dialog>
        </>
    );
}


export default AddMemberForm;