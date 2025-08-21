import { useAuth } from "@/providers/AuthContext";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Button } from "../ui/button";
import { Form, FormLabel } from "../ui/form";
import { Input } from "../ui/input";
import z from "zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import DeleteGroupDialog from "./DeleteGroupDialog";
import { useGroupContext } from "@/providers/GroupContext";
import ColorPicker from "../ColorPicker";
import { hexadecimalColorRegex } from "@/utils/colorUtils";

const formSchema = z.object({
    groupName: z.string()
        .min(2, {message: "Please enter at least two characters"})
        .max(20, {message: "Please enter less than twenty characters"}),
})

const ModifyGroupDialog = () => {
    const {token} = useAuth();
    const {selectedGroup, rechargeUserGroups, rechargeGroupContent} = useGroupContext();
    const API = import.meta.env.VITE_REACT_APP_API_URL
    
    const [nameError, setNameError] = useState("");
    const [colorError, setColorError] = useState("");
    const [fetchError, setFetchError] = useState("");

    const [parentDialogOpen, setParentDialogOpen] = useState(false);

    const [groupName, setGroupName] = useState("My New Group");
    const [color, setColor] = useState("#aabbcc");

    useEffect(() => {
        setColor("" + selectedGroup?.groupColor);
        setGroupName("" + selectedGroup?.groupName);
    }, [selectedGroup])


    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            groupName: "",
        },
    })

    const openAndResetDialog = () => {
        setParentDialogOpen(true);

        // Reset errors
        setFetchError("");
        setNameError("");
        setColorError("");

        // Reset Content
        setColor("" + selectedGroup?.groupColor);
        setGroupName("" + selectedGroup?.groupName);
    }

    const onSubmitModify = async () => {
        setFetchError(""); // this is used to show the error reloads when trying again
        setNameError("");
        setColorError("");

        let error = false;
        if (!hexadecimalColorRegex.test(color)) {
            setColorError("Color must be an Hexadecimal with a # and 6 characters")
            error = true;
        }

        if (groupName.length < 2) {
            setNameError("Please enter at least two characters for the group name")
            error = true;
        } else if ( groupName.length > 20 ) {
            setNameError("Please enter less than twenty characters for the group name")
            error = true;
        }

        if(error) {
            return;
        }

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
                    groupName: groupName,
                    groupColor: color,
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
            toast("Group " + groupName + " was successfully modified !");
            setParentDialogOpen(false);
            
            rechargeUserGroups(json);
            rechargeGroupContent();

        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error(error.message);
                toast("Error trying to modify a group : " + error.message)
            }
        }
    }
    

    return (
        <>
            <Dialog open={parentDialogOpen}>
                <DialogTrigger className="m-0" tabIndex={-1}>

                    <Button 
                        className="m-0 ml-2 p-0 pl-1 pr-1 bg-transparent hover:bg-transparent text-secondary-foreground hover:text-primary shadow-none cursor-pointer"
                        onClick={openAndResetDialog}
                    >
                        ...
                    </Button>

                </DialogTrigger>
                <DialogContent showCloseButton={false}>
                    <DialogHeader>
                        <DialogTitle>Modify your group informations</DialogTitle>
                    </DialogHeader>

                    <Form {...form}>
                        <form onSubmit= {form.handleSubmit(onSubmitModify)} className="space-y-8">

                        <FormLabel className="mb-2">New Group name : </FormLabel>
                        <Input placeholder="My Cool Group" value={groupName} onChange={(event) => setGroupName(event.target.value)}/>
                        <p className="text-red-600 mt-0">{nameError}</p>
                        
                        <FormLabel className="mb-2">New Group color : </FormLabel>
                        <ColorPicker color={color} setColor={setColor} error={colorError}/>
                        <p className="text-red-600">{fetchError}</p>

                        <DeleteGroupDialog setParentDialogOpen={setParentDialogOpen}/>
                        
                        <DialogFooter>
                            <Button type="button" onClick={() => setParentDialogOpen(false)}>Cancel</Button>
                            <Button type="submit" onClick={onSubmitModify} variant="secondary">Modify</Button>
                        </DialogFooter>
                            
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
        </>
    );
}


export default ModifyGroupDialog;