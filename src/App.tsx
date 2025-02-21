import { useEffect, useState } from "react";
import MainContent from "./components/MainContent";
import ProjectsBar from "./components/ProjectsBar";
import TopBar from "./components/TopBar";
import AuthentificationComponent from "./components/AuthentificationComponent";

function App() {

    const [serversData, setServersData] = useState();

    useEffect(() => {}, [serversData]);

    return (
        <div className='bg-secondary flex'>
            { serversData ? (
                <>
                    <MainContent username={serversData}/>
                    <TopBar/>
                    <ProjectsBar/>
                </>
            ) : (
                <>
                    <div className="bg-secondary flex items-center justify-center fixed top-0 left-0 w-full h-full">
                        <AuthentificationComponent/>
                    </div>
                </>
            )}
        </div>
    )
}

export default App;
