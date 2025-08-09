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
import DeleteGroupDialog from "./DeleteGroupDialog";
import { useGroupContext } from "@/providers/GroupContext";

const formSchema = z.object({
    groupName: z.string()
        .min(3, {message: "Please enter at least three characters"})
        .max(50, {message: "Please enter less than fifty characters"}),
    color: z.string()
        .min(6, {message: "Please enter a valid Hexadecimal color value without the #"})
        .max(6, {message: "Please enter a valid Hexadecimal color value without the #"})
})

const ModifyGroupDialog = () => {
    const {token} = useAuth();
    const {selectedGroup} = useGroupContext();

    const API = import.meta.env.VITE_REACT_APP_API_URL
    const navigate = useNavigate();
    
    const [fetchError, setFetchError] = useState("");


    // const { register, setValue } = useForm();

    // const groupNameInput = useRef<React.ComponentProps<"input">>(null);
    // const groupColorInput = useRef<React.ComponentProps<"input">>(null);

    useEffect( () => {
        if (selectedGroup != null ){
            // if (groupNameInput.current && groupColorInput.current) {
            //     setValue("groupNameInput", selectedGroup.groupName);

            //     groupNameInput.current.value = selectedGroup.groupName;
            //     groupColorInput.current.value = selectedGroup.groupColor;
            //     console.log("AAAAH : ça marche fdp ?????")
            // }
            // console.log("AAAAH : get fucked regular")
            // setValue("groupNameInput", selectedGroup.groupName);
        } 
    }, [selectedGroup])

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            groupName: "",
            color: "",
        },
    })

    const onSubmitModify = async (values: z.infer<typeof formSchema>) => {
        setFetchError(""); // this is used to show the error reloads when trying again
        try {
            if (selectedGroup == null) {
                throw new Error(`No group selected`);
            }
            
            const response = await fetch(API + "/group", {
                method: "put",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    groupID: selectedGroup.id,
                    groupName: values.groupName,
                    groupColor: "#" + values.color,
                }) 
            });

            if (!response.ok ) {
                if ([401, 403].indexOf(response.status) !== -1) {
                setFetchError("You don't have the rights to modify this group !");
                    return
                }
                throw new Error(`Response status text: ${response.status}`);
            }
            const json = await response.json();
            console.log("result : ", json);
            toast("Group " + values.groupName + " was successfully modified !");
            navigate(0); // refresh the page

        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error(error.message);
                toast("Error trying to modify a group : " + error.message)
            }
        }
    }
    

    return (
        <>
            <Toaster/>
            <Dialog>
                <DialogTrigger className="m-0">

                    <Button 
                        className="m-0 ml-2 p-0 pl-1 pr-1 bg-transparent hover:bg-transparent text-secondary-foreground hover:text-primary shadow-none cursor-pointer"
                    >
                        ...
                    </Button>

                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Modify your group informations</DialogTitle>
                    </DialogHeader>

                    <Form {...form}>
                        <form onSubmit= {form.handleSubmit(onSubmitModify)} className="space-y-8">
                        <FormField
                            control={form.control}
                            name="groupName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Group name</FormLabel>
                                        <FormControl>
                                            <Input 
                                                placeholder="Enter a new group name"
                                                {...field} 
                                            />
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
                                            <Input
                                                placeholder="Enter a new color" 
                                                {...field} 
                                            />
                                        </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <p className="text-red-600">{fetchError}</p>

                        <DeleteGroupDialog/>
                        
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


export default ModifyGroupDialog;