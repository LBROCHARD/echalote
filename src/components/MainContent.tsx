// import { ReactElement, JSXElementConstructor, ReactNode, ReactPortal } from "react";

interface MainContentProps {
    username: string;
}

const MainContent = (props: MainContentProps) => {

    return (
        <div className="bg-secondary fixed top-0 h-screen w-screen flex flex-col shadow pl-16 pt-32">
            <p className="text-white">{props.username}</p>
            <textarea className="max-h-200 m-5 text-white bg-secondary"/>
        </div>
    );
}


export default MainContent;