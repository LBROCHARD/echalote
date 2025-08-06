import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarHeader, SidebarInput, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar"
import logo from '/SuperNotes_icon.png';
import userIcon from '/User.png';
import { Calendar, Home, Inbox, Search, Settings } from "lucide-react"
import { Link } from "react-router-dom"
import { useAuth } from "@/providers/AuthContext";
import { useEffect, useState } from "react";

interface Group {
    serverName: string;
    serverColor: string;
}

const ContentSideBar = () => {
    const { user, token } = useAuth();

    const [groups, setgroups] = useState<Group[]>([]);

    const setGroups = async () => {
        const API = import.meta.env.VITE_REACT_APP_API_URL

        try {
            const response = await fetch(API + "/server", {
                method: "get",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            });

            if (!response.ok ) {
                throw new Error(`Response status text: ${response.status}`);
            }

            const json = await response.json();
            console.log("groups : ", json);
            setgroups(json);
            // TODO : deserialize from json and put in items
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error(error.message);
            }
        }
    }

    useEffect(() => {
        setGroups();
    }, []);
    
    // Menu items.
    const items = [
        {
            title: "Home",
            url: "#",
            icon: Home,
        },
        {
            title: "Inbox",
            url: "#",
            icon: Inbox,
        },
        {
            title: "Calendar",
            url: "#",
            icon: Calendar,
        }
    ]

    return (
        <Sidebar
            collapsible="icon"
            className="overflow-hidden *:data-[sidebar=sidebar]:flex-row"
        >

            <Sidebar
                collapsible="none"
                className="w-[calc(var(--sidebar-width-icon)+1px)]! border-r"
            >
                <SidebarHeader>
                    <SidebarMenuButton size="lg" asChild className="md:h-8 md:p-0" tooltip={"Home"}>
                        <Link to="/" className="flex aspect-square size-8 items-center justify-center rounded-lg">
                            <img src={logo} alt="Super Notes"/>
                        </Link>
                    </SidebarMenuButton>
                </SidebarHeader>

                <SidebarContent>
                    <SidebarGroup>
                        {groups.map((item) => (
                            <SidebarMenuButton
                                tooltip={{
                                    children: item.serverName + item.serverColor,
                                    hidden: false,
                                }}
                                className="ml-0 text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg cursor-pointer"
                                style={{ backgroundColor: item.serverColor }}
                            >
                                <p>{item.serverName.substring(0,2)}</p>
                            </SidebarMenuButton>
                        ))}
                    </SidebarGroup>
                </SidebarContent>

                <SidebarFooter>
                    <SidebarMenuButton size="lg" asChild className="md:h-8 md:p-0" tooltip={"Create a new group"}>
                        <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg cursor-pointer">
                            <p>+</p>
                        </div>
                    </SidebarMenuButton>
                    <SidebarMenuButton size="lg" asChild className="md:h-8 md:p-0" tooltip={"Go to " + user?.username + " account page"}>
                        <Link to="/account" className="flex aspect-square size-8 items-center justify-center rounded-lg">
                            <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                                <img src={userIcon} alt={user?.username + " account"}/>
                            </div>
                        </Link>
                    </SidebarMenuButton>
                </SidebarFooter>
            </Sidebar>



            <Sidebar collapsible="none" className="hidden flex-1 md:flex">
                <SidebarHeader className="gap-3.5 border-b p-4">
                    <div className="flex w-full items-center justify-between">
                        nom du serveur
                    </div>
                    <SidebarInput placeholder="Type to search..." />
                </SidebarHeader>

                <SidebarContent>
                    <SidebarGroup className="px-0">
                        <SidebarGroupContent>
                        {/* {mails.map((mail) => (
                            <a
                            href="#"
                            key={mail.email}
                            className="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground flex flex-col items-start gap-2 border-b p-4 text-sm leading-tight whitespace-nowrap last:border-b-0"
                            >
                            <div className="flex w-full items-center gap-2">
                                <span>{mail.name}</span>{" "}
                                <span className="ml-auto text-xs">{mail.date}</span>
                            </div>
                            <span className="font-medium">{mail.subject}</span>
                            <span className="line-clamp-2 w-[260px] text-xs whitespace-break-spaces">
                                {mail.teaser}
                            </span>
                            </a>
                        ))} */}
                        </SidebarGroupContent>
                    </SidebarGroup>
                </SidebarContent>

            </Sidebar>
        </Sidebar>
    )
}

export default ContentSideBar;