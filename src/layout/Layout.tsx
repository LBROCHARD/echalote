import ContentSideBar from "@/components/ContentSideBar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useAuth } from "@/providers/AuthContext";
import { GroupContextProvider } from "@/providers/GroupContext";
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
                <GroupContextProvider>
                    <ContentSideBar/>
                    <main className="flex flex-col h-screen w-full">
                        <SidebarTrigger/>
                        <Outlet/>
                    </main>
                </GroupContextProvider>
            </SidebarProvider>
        </>
    )
}

export default Layout;
