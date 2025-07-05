import { useEffect, useState } from "react";
import MainContent from "./components/MainContent";
import ProjectsBar from "./components/ProjectsBar";
import TopBar from "./components/TopBar";
import AuthentificationComponent from "./components/AuthentificationComponent";
import { Button } from "./components/ui/button";

function App() {

    const [serversData, setServersData] = useState();

    useEffect(() => {}, [serversData]);

    return (
        <div className='bg-secondary flex'>
            { serversData ? (
                <>
                    <MainContent username={serversData}/>
                    <TopBar/>
                    <ProjectsBar username={serversData}/>
                </>
            ) : (
                <>
                    <AuthentificationComponent setServersData={setServersData}/>
                </>
            )}
        </div>
    )
}

export default App;
