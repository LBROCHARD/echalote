import ContactSideBar from "@/components/ContactSideBar";
import ContentSideBar from "@/components/ContentSideBar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useAuth } from "@/providers/AuthContext";
import BreadCrumbProvider from "@/providers/BreadCrumbContext";
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
                <BreadCrumbProvider>
                    <ContentSideBar/>
                    <main className="flex flex-col h-screen w-full">
                        <SidebarTrigger/>
                        <Outlet/>
                    </main>
                </BreadCrumbProvider>
            </SidebarProvider>
        </>
    )
}

export default Layout;
