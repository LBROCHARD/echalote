import { useEffect, useState } from "react";
import MainContent from "./components/MainContent";
import ProjectsBar from "./components/ProjectsBar";
import TopBar from "./components/TopBar";
import RegisterForm from "./components/auth/RegisterForm";

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
                    <RegisterForm/>
                </>
            )}
        </div>
    )
}

export default App;
