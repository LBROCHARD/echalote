import { useAuth } from "@/providers/AuthContext";
import z from "zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { SidebarMenuButton } from "../ui/sidebar";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useGroupContext } from "@/providers/GroupContext";
import ColorPicker from "../ColorPicker";
import { hexadecimalColorRegex } from "@/utils/colorUtils";

const formSchema = z.object({
    groupName: z.string()
        .min(2, {message: "Please enter at least two characters"})
        .max(50, {message: "Please enter less than fifty characters"}),
})


const CreateGroupForm = () => {
    const {token} = useAuth();
    const API = import.meta.env.VITE_REACT_APP_API_URL
    const {rechargeUserGroups} = useGroupContext();
    
    const [fetchError, setFetchError] = useState("");
    const [dialogOpen, setDialogOpen] = useState(false);

    const [color, setColor] = useState("#3684d2");
    const [colorError, setColorError] = useState("");

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            groupName: "My new group",
        },
    })

    const openDialogAndResetContent = () => {
        setDialogOpen(true);
        setColorError("");
        setColor("#3684d2");
    }

    const onSubmitCreate = async (values: z.infer<typeof formSchema>) => {
        setFetchError(""); // this is used to show the error reloads when trying again
        setColorError("");

        if (!hexadecimalColorRegex.test(color)) {
            setColorError("Color must be an Hexadecimal with a # and 6 characters")
            return;
        }


        try {
            const response = await fetch(API + "/group", {
                method: "post",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    groupName: values.groupName,
                    groupColor: color,
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
            setDialogOpen(false);
            rechargeUserGroups(json);

        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error(error.message);
                toast("Error trying to create group : " + error.message)
            }
        }
    }
    

    return (
        <>
            <Dialog open={dialogOpen}>
                <DialogTrigger className="m-0">
                    
                    <SidebarMenuButton 
                        asChild 
                        className="hover:bg-primary rounded-lg" 
                        tooltip={{children: "Create a new group", hidden: false,}} 
                        onClick={openDialogAndResetContent}
                    >
                        <div className="bg-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg cursor-pointer">
                            <p>+</p>
                        </div>
                    </SidebarMenuButton>

                </DialogTrigger>
                <DialogContent showCloseButton={false}>
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
                        <FormLabel className="mb-2">New Group color : </FormLabel>
                        <ColorPicker color={color} setColor={setColor} error={colorError}/>
                        
                        <p className="text-red-600">{fetchError}</p>
                        
                        <DialogFooter>
                            <Button type="button" onClick={() => setDialogOpen(false)}>Close</Button>
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