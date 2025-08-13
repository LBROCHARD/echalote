import { useGroupContext } from "@/providers/GroupContext";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { useAuth } from "@/providers/AuthContext";
import { toast, Toaster } from "sonner";
import ModifyPageDialog from "./pages/ModifyPageDialog";
import { BookOpen, PencilLine, Save } from "lucide-react";
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'


const MainContent = () => {
    const API = import.meta.env.VITE_REACT_APP_API_URL
    const {selectedPage, selectedGroup} = useGroupContext();
    const { token } = useAuth();
    const navigate = useNavigate();

    const returnRegex = /\n/gi;

    const [pageContent, setPageContent] = useState(selectedPage?.content);
    const [isSaveBtnShown, setIsSaveBtnShown] = useState(false);

    const [isEditMode, setIsEditMode] = useState(true);

    useEffect(() => {
        if (selectedPage == null ) {
            navigate("/");
        } else {
            setPageContent(selectedPage?.content);
        }
    }, []);

    useEffect(() => {
        if (selectedPage != null) {
            setPageContent(selectedPage?.content);
        }
        setIsSaveBtnShown(false);
    }, [selectedPage]);

    function SaveButton() {
        if (isSaveBtnShown) {
            return (
                <Button onClick={updatePageContent} className="m-0" data-testid="saveButton">
                    <Save/>
                    Save Modifications
                </Button>
            )
        }
        return;
    }

    const changeEditMode = (isEdit: boolean) => {
        setIsEditMode(isEdit);
    }

    function EditBtnContent() {
        if (isEditMode) {
            return(
                <>
                    <PencilLine />
                    Edit mode
                </>
            )
        } else {
            return (
                <>
                    <BookOpen />
                    Reading mode
                </>
            )
        }
    }

    const updatePageContent = async () => {
        try {
            const response = await fetch(API + "/pages/content", {
                method: "put",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    groupId: selectedGroup?.id,
                    pageId: selectedPage?.id,
                    pageContent: pageContent,
                })
            });

            if (!response.ok ) {
                throw new Error(`Response status text: ${response.status}`);
            }

            const json = await response.json();
            console.log("response : ", json);
            toast("Content saved !")

            setIsSaveBtnShown(false);

        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error(error.message);
                toast(error.message)
            }
        }
    }

    return (
        <div className="flex flex-col h-full">
            <Toaster/>
            <p>{selectedPage? "selectedPage is NOT NULL" : "selectedPage is NULL"}</p>
            <div 
                className="h-auto shadow-xl"
                style={{backgroundColor: "#" + selectedPage?.pageColor}}
            >
                <div className="w-full flex flex-row items-center">
                    <h1 className="text-white font-bold m-0 mt-5 ml-12">{selectedPage?.pageName}</h1>
                    <ModifyPageDialog/>
                </div>
                <div className="m-2 h-8 ml-12 flex items-center flex-row">
                    <ul className="flex">
                        {selectedPage?.tags.split(" ").map((tag) => (
                            <p className=" text-white mr-3">{"#" + tag}</p>
                        ))}
                    </ul>
                </div>
            </div>

            <div className="p-5 pb-1 flex flex-col h-full content-center justify-center items-center ">
                <div className="w-full h-auto p-0 m-0 flex flex-row justify-between content-center">
                    <Button onClick={() => { changeEditMode(!isEditMode) } } className="m-0" data-testid="editModeButton">
                        <EditBtnContent/>
                    </Button>

                    <SaveButton/>
                </div>

                <div className="h-full w-full mt-2 ml-10" hidden={!isEditMode} data-testid="markdownDiv"> 
                    <Markdown remarkPlugins={[remarkGfm]}>
                        {pageContent?.replace(returnRegex, "\n\n")}
                    </Markdown>
                </div>
                <Textarea
                    hidden={isEditMode}
                    className="mt-5 ml-5 mr-5 pl-6 pt-4 h-full bg-accent border-transparent border-0 shadow-none rounded-m resize-none"
                    value={pageContent}
                    onChange={(event) => {
                        setPageContent(event.target.value);
                        if (selectedPage!= null && selectedPage?.content != event.target.value) {
                            setIsSaveBtnShown(true);
                        }
                    }}
                    placeholder="Write something !"
                    data-testid="editContentTextArea"
                />
            </div>
        </div>
    );
}


export default MainContent;