import MainContent from "@/components/MainContent";
import ProjectsBar from "@/components/ProjectsBar";
import TopBar from "@/components/TopBar";
import { Outlet } from "react-router-dom";

interface MainPageProps {
    token: string;
}

const MainPage = (props: MainPageProps) => {
    return (
        <>
            <MainContent token={props.token}/>
            <TopBar/>
            <ProjectsBar token={props.token}/>
            <Outlet/>
        </>
    )
}

export default MainPage;
