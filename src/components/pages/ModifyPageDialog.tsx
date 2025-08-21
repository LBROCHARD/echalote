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
import { useGroupContext } from "@/providers/GroupContext";
import { Settings } from "lucide-react";
import DeletePageDialog from "./DeletePageDialog";
import { hexadecimalColorRegex, isColorDark } from "@/utils/colorUtils";
import ColorPicker from "../ColorPicker";

const formSchema = z.object({
    pageTitle: z.string()
        .min(2, {message: "Please enter at least two characters"})
        .max(50, {message: "Please enter less than fifty characters"}),
    pageTags: z.string()
})

const ModifyPageDialog = () => {
    const {token} = useAuth();
    const {selectedGroup, selectedPage, rechargeGroupContent} = useGroupContext();

    const API = import.meta.env.VITE_REACT_APP_API_URL

    const isDark = isColorDark(selectedPage? selectedPage.pageColor : "FFFFFF");
    const iconColor = isDark ? 'text-white' : 'text-black';
    
    const [pageNameError, setPageNameError] = useState("");
    const [pageColorError, setPageColorError] = useState("");
    const [fetchError, setFetchError] = useState("");

    const [pageParentDialogOpen, setPageParentDialogOpen] = useState(false);

    const [pageName, setPageName] = useState("My New Page");
    const [pageTags, setPageTags] = useState("page");
    const [color, setColor] = useState("#aabbcc");

    useEffect(() => {
        const newcolor = selectedPage ? selectedPage.pageColor : "FFFFFF"
        setColor("#" + newcolor);
        setPageName("" + selectedPage?.pageName);
        setPageTags("" + selectedPage?.tags);
    }, [selectedPage])

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            pageTitle: "",
            pageTags: "",
        },
    })

    const openAndResetDialog = () => {
        setPageParentDialogOpen(true);

        // Reset errors
        setFetchError("");
        setPageNameError("");
        setPageColorError("");

        // Reset Content
        const newcolor = selectedPage ? selectedPage.pageColor : "FFFFFF"
        setColor("#" + newcolor);
        setPageName("" + selectedPage?.pageName);
        setPageTags("" + selectedPage?.tags);
    }

    const onSubmitModify = async () => {
        setFetchError(""); // this is used to show the error reloads when trying again
        setPageColorError("");
        setPageNameError("");

        let error = false;
        if (!hexadecimalColorRegex.test(color)) {
            setPageColorError("Color must be an Hexadecimal with a # and 6 characters")
            error = true;
        }

        if (pageName.length < 1) {
            setPageNameError("Please enter at least one characters for the Page name")
            error = true;
        } else if ( pageName.length > 50 ) {
            setPageNameError("Please enter less than fifty characters for the Page name")
            error = true;
        }

        if(error) {
            return;
        }
        
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
                    pageName: pageName,
                    pageColor: color.substring(1,7),
                    pageTags: pageTags
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
            toast("Page " + pageName + " was successfully modified !");
            rechargeGroupContent();
            setPageParentDialogOpen(false);

            rechargeGroupContent(json);


        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error(error.message);
                toast("Error trying to modify a Page : " + error.message)
            }
        }
    }
    

    return (
        <>
            <Dialog open={pageParentDialogOpen}>
                <DialogTrigger 
                    className="m-0 p-0 bg-transparent text-white hover:text-black hover:bg-transparent shadow-none ml-3 mt-5" 
                    onClick={openAndResetDialog}
                >
                    <Settings className={"w-5 h-5 " + iconColor}/>
                </DialogTrigger>

                <DialogContent showCloseButton={false}>
                    <DialogHeader>
                        <DialogTitle>Modify your page informations</DialogTitle>
                    </DialogHeader>

                    <Form {...form}>
                        <form onSubmit= {form.handleSubmit(onSubmitModify)} className="space-y-8">
                        
                        <FormLabel className="mb-2">New Page name : </FormLabel>
                        <Input placeholder="My Cool Group" value={pageName} onChange={(event) => setPageName(event.target.value)}/>
                        <p className="text-red-600">{pageNameError}</p>

                        <FormLabel className="mb-2">New Page color : </FormLabel>
                        <ColorPicker color={color} setColor={setColor} error={pageColorError}/>
                        
                        <FormLabel className="mb-2">New Tags : </FormLabel>
                        <Input placeholder="My Cool Group" value={pageTags} onChange={(event) => setPageTags(event.target.value)}/>

                        <p className="text-red-600">{fetchError}</p>

                        <DeletePageDialog setParentDialogOpen={setPageParentDialogOpen}/>
                        
                        <DialogFooter>
                            <Button type="button" onClick={() => setPageParentDialogOpen(false)}>Cancel</Button>
                            <Button type="submit" onClick={onSubmitModify} variant="secondary">Modify</Button>
                        </DialogFooter>
                            
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
        </>
    );
}


export default ModifyPageDialog;