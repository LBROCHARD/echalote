import ProjectsBar from "@/components/ProjectsBar";
import TopBar from "@/components/TopBar";
import { useAuth } from "@/providers/AuthContext";
import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useNavigate } from "react-router-dom";



const Layout = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        if (!isAuthenticated) {
            navigate("/login");
        }
    }, [isAuthenticated]);

    return (
        <>
            <TopBar/>
            <ProjectsBar/>
            <Outlet/>
        </>
    )
}

export default Layout;
