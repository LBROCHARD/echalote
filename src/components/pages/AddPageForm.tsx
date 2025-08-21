import { useAuth } from "@/providers/AuthContext";
import z from "zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast, Toaster } from "sonner";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { SidebarMenuButton, SidebarMenuItem } from "../ui/sidebar";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useGroupContext } from "@/providers/GroupContext";
import ColorPicker from "../ColorPicker";
import { hexadecimalColorRegex } from "@/utils/colorUtils";


const formSchema = z.object({
    pageName: z.string()
        .min(3, {message: "Please enter at least three characters"})
        .max(50, {message: "Please enter less than fifty characters"}),
    pageTags: z.string()
})


const AddPageForm = () => {
    const {token} = useAuth();
    const {selectedGroup, rechargeGroupContent} = useGroupContext();
    const API = import.meta.env.VITE_REACT_APP_API_URL
    
    const [fetchError, setFetchError] = useState("");
    const [dialogOpen, setDialogOpen] = useState(false);

    const [color, setColor] = useState("#aabbcc");
    const [colorError, setColorError] = useState("");

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            pageName: "New Page",
            pageTags: "page"
        },
    })

    const openPageDialogAndResetContent = () => {
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
            if (selectedGroup == null ) {
                throw new Error(`No group selected`);
            }

            const response = await fetch(API + "/pages", {
                method: "post",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    groupId: selectedGroup.id,
                    pageName: values.pageName,
                    pageColor: color.substring(1,7),
                    tags: values.pageTags
                }) 
            });

            if (!response.ok ) {
                if ([401, 403].indexOf(response.status) !== -1) {
                    setFetchError("You don't have the rights to add this Page to the group !");
                } else if ([404].indexOf(response.status) !== -1) {
                    setFetchError("This User or this Group does not exist !");
                }
                throw new Error(`Response status text: ${response.status}`);
            }
            const json = await response.json();
            console.log("result : ", json);
            toast("Page " + values.pageName + " was successfully added to the group !");
            setDialogOpen(false);
            rechargeGroupContent();


        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error(error.message);
                if (fetchError == "") {
                    setFetchError("Error trying to add member to the group : " + error.message)
                }
                toast("Error trying to add member to the group : " + error.message)
            }
        }
    }
    

    return (
        <>
            <Toaster/>
            <Dialog open={dialogOpen}>
                <DialogTrigger>
                    <SidebarMenuItem className="list-none m-0">
                        <SidebarMenuButton asChild className="cursor-pointer m-0" onClick={openPageDialogAndResetContent}>
                            <p className="text-muted-foreground"> + Create a new page</p>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </DialogTrigger>

                <DialogContent showCloseButton={false}>
                    <DialogHeader>
                        <DialogTitle>Add a new Page to your group !</DialogTitle>
                    </DialogHeader>

                    <Form {...form}>
                        <form onSubmit= {form.handleSubmit(onSubmitCreate)} className="space-y-8">
                            <FormField
                                control={form.control}
                                name="pageName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>New Page Name</FormLabel>
                                            <FormControl>
                                                <Input  placeholder="New Page Name" {...field} />
                                            </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormLabel className="mb-2">New Page color : </FormLabel>
                            <ColorPicker color={color} setColor={setColor} error={colorError}/>
                            <FormField
                                control={form.control}
                                name="pageTags"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Tags (separated by spaces)</FormLabel>
                                            <FormControl>
                                                <Input  placeholder="page important knowledge" {...field} />
                                            </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <p className="text-red-600">{fetchError}</p>
                            <DialogFooter>
                                <Button type="button" onClick={() => setDialogOpen(false)}>Close</Button>
                                <Button type="submit" variant="secondary">Create New Page</Button>
                            </DialogFooter>
                        </form>
                    </Form> 
                </DialogContent>
                
            </Dialog>
        </>
    );
}


export default AddPageForm;