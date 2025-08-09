import { useGroupContext } from "@/providers/GroupContext";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

const MainContent = () => {
    const {selectedPage} = useGroupContext();
    const navigate = useNavigate();

    useEffect(() => {
        if (selectedPage == null ) {
            navigate("/")
        }
    }, []);

    const tags = [
        "cool",
        "very_great",
        "code",
        "important"
    ]

    return (
        <>
            <div 
                className="h-auto shadow-xl"
                style={{backgroundColor: "#" + selectedPage?.pageColor}}
            >
                <h1 className="text-white font-bold m-0 mt-5 ml-12">{selectedPage?.pageName}</h1>
                <div className="m-2 h-8 ml-12 flex items-center flex-row">
                    <ul className="flex">
                        {tags.map((tag) => ( 
                            // TODO : remplacer les texts par 
                            <p className=" text-white mr-3">{"#" + tag}</p>
                        ))}
                        <Button className="m-0 p-0 h-auto aspect-square bg-transparent hover:bg-transparent hover:text-black text-center shadow-none">
                            +
                        </Button>
                    </ul>
                </div>
            </div>

            <div>
                <p className="m-5">{selectedPage?.content}</p>
            </div>
        </>
    );
}


export default MainContent;