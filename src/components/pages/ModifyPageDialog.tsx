import { useAuth } from "@/providers/AuthContext";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Button } from "../ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import z from "zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast, Toaster } from "sonner";
import { useNavigate } from "react-router-dom";
import { useGroupContext } from "@/providers/GroupContext";
import { Settings } from "lucide-react";
import DeletePageDialog from "./DeletePageDialog";

const formSchema = z.object({
    pageTitle: z.string()
        .min(3, {message: "Please enter at least three characters"})
        .max(50, {message: "Please enter less than fifty characters"}),
    pageColor: z.string()
        .min(6, {message: "Please enter a valid Hexadecimal color value without the #"})
        .max(6, {message: "Please enter a valid Hexadecimal color value without the #"}),
    pageTags: z.string()
})

const ModifyPageDialog = () => {
    const {token} = useAuth();
    const {selectedGroup, selectedPage} = useGroupContext();

    const API = import.meta.env.VITE_REACT_APP_API_URL
    const navigate = useNavigate();
    
    const [fetchError, setFetchError] = useState("");

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            pageTitle: "",
            pageColor: "",
            pageTags: "",
        },
    })

    const onSubmitModify = async (values: z.infer<typeof formSchema>) => {
        setFetchError(""); // this is used to show the error reloads when trying again
        try {
            if (selectedGroup == null || selectedPage == null) {
                throw new Error(`No group, or no page selected`);
            }
            
            const response = await fetch(API + "/pages", {
                method: "put",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    groupId: selectedGroup.id,
                    pageId: selectedPage.id,
                    pageName: values.pageTitle,
                    pageColor: values.pageColor,
                    pageTags: values.pageTags
                }) 
            });

            if (!response.ok ) {
                if ([401, 403].indexOf(response.status) !== -1) {
                setFetchError("You don't have the rights to modify this Page !");
                    return
                }
                throw new Error(`Response status text: ${response.status}`);
            }
            const json = await response.json();
            console.log("result : ", json);
            toast("Page " + values.pageTitle + " was successfully modified !");
            navigate(0); // refresh the page

        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error(error.message);
                toast("Error trying to modify a Page : " + error.message)
            }
        }
    }
    

    return (
        <>
            <Toaster/>
            <Dialog>
                <DialogTrigger className="m-0 p-0 bg-transparent text-white hover:text-black hover:bg-transparent shadow-none ml-3 mt-5">
                    <Settings className="w-5 h-5"/>
                </DialogTrigger>

                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Modify your page informations</DialogTitle>
                    </DialogHeader>

                    <Form {...form}>
                        <form onSubmit= {form.handleSubmit(onSubmitModify)} className="space-y-8">
                        <FormField
                            control={form.control}
                            name="pageTitle"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>New Page Title</FormLabel>
                                        <FormControl>
                                            <Input 
                                                placeholder="Enter a new page name"
                                                {...field} 
                                            />
                                        </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="pageColor"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>New Color (Hex format)</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Enter a new color" 
                                                {...field} 
                                            />
                                        </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="pageTags"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Page Tags (separated by spaces)</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Enter new tags" 
                                                {...field} 
                                            />
                                        </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <p className="text-red-600">{fetchError}</p>

                        <DeletePageDialog/>
                        
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button>Cancel</Button>
                            </DialogClose>
                            <Button type="submit" variant="secondary">Modify</Button>
                        </DialogFooter>
                            
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
        </>
    );
}


export default ModifyPageDialog;