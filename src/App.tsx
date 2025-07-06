import { useEffect, useState } from "react";
import MainContent from "./components/MainContent";
import ProjectsBar from "./components/ProjectsBar";
import TopBar from "./components/TopBar";
import RegisterForm from "./components/auth/RegisterForm";
import LoginForm from "./components/auth/LoginForm";

function App() {

    const [token, setToken] = useState("");

    useEffect(() => {}, [token]);

    return (
        <div className='bg-secondary flex'>
            { token ? (
                <>
                    <MainContent token={token}/>
                    <TopBar/>
                    <ProjectsBar token={token}/>
                </>
            ) : (
                <>
                    <RegisterForm/>
                    <LoginForm setToken={setToken}/>
                </>
            )}
        </div>
    )
}

export default App;
