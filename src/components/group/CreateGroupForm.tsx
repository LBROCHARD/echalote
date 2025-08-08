import { useAuth } from "@/providers/AuthContext";
import z from "zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast, Toaster } from "sonner";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { SidebarMenuButton } from "../ui/sidebar";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

const formSchema = z.object({
    groupName: z.string()
        .min(3, {message: "Please enter at least three characters"})
        .max(50, {message: "Please enter less than fifty characters"}),
    color: z.string()
        .min(6, {message: "Please enter a valid Hexadecimal color value without the #"})
        .max(6, {message: "Please enter a valid Hexadecimal color value without the #"})
})


const CreateGroupForm = () => {
    const {token} = useAuth();
    const API = import.meta.env.VITE_REACT_APP_API_URL
    const navigate = useNavigate();
    
    const [fetchError, setFetchError] = useState("");

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            groupName: "My new group",
            color: "00FF55",
        },
    })

    const onSubmitCreate = async (values: z.infer<typeof formSchema>) => {
        setFetchError(""); // this is used to show the error reloads when trying again
        try {
            const response = await fetch(API + "/group", {
                method: "post",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    groupName: values.groupName,
                    groupColor: "#" + values.color,
                }) 
            });

            if (!response.ok ) {
                if ([401, 403].indexOf(response.status) !== -1) {
                setFetchError("You don't have the rights to create a group !");
                    return
                }
                throw new Error(`Response status text: ${response.status}`);
            }
            const json = await response.json();
            console.log("result : ", json);
            toast("Group " + values.groupName + " was successfully created !");
            navigate(0); // refresh the page
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error(error.message);
                toast("Error trying to create group : " + error.message)
            }
        }
    }
    

    return (
        <>
            <Toaster/>
            <Dialog>
                <DialogTrigger className="m-0">
                    
                    <SidebarMenuButton size="lg" asChild className="md:h-8 md:p-0" tooltip={{children: "Create a new group", hidden: false,}}>
                        <div className="bg-primary hover:bg-secondary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg cursor-pointer">
                            <p>+</p>
                        </div>
                    </SidebarMenuButton>

                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Create a new Group !</DialogTitle>
                    </DialogHeader>

                    <Form {...form}>
                        <form onSubmit= {form.handleSubmit(onSubmitCreate)} className="space-y-8">
                        <FormField
                            control={form.control}
                            name="groupName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Group name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="My New Group" {...field} />
                                        </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="color"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Color (Hex format)</FormLabel>
                                        <FormControl>
                                            <Input placeholder="00FF55" {...field} />
                                        </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <p className="text-red-600">{fetchError}</p>
                        
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button>Close</Button>
                            </DialogClose>
                            <Button type="submit" variant="secondary">Confirm</Button>
                        </DialogFooter>
                            
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
        </>
    );
}


export default CreateGroupForm;