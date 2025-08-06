import ContentSideBar from "@/components/ContentSideBar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
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
            <SidebarProvider>
                <ContentSideBar/>
                <main>
                    <SidebarTrigger />
                    <Outlet/>
                </main>
            </SidebarProvider>
        </>
    )
}

export default Layout;
