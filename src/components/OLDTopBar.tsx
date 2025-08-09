// import { ReactElement, JSXElementConstructor, ReactNode, ReactPortal } from "react";

const TopBar = () => {

    return (
        <div className="bg-blue-600 fixed top-0 h-32 w-screen flex flex-col shadow pl-16">
            <h1 className="text-white text-2xl font-bold ml-5 mt-3">Page name</h1>
            <p className="ml-5 mt-1 text-gray-800">$unique_page_name</p>
        </div>
    );
}


export default TopBar;