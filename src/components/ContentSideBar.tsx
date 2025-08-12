import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarInput, SidebarMenuButton, SidebarMenuItem, } from "@/components/ui/sidebar"
import logo from '/SuperNotes_icon.png';
import userIcon from '/User.png';
import { Link } from "react-router-dom"
import { useAuth } from "@/providers/AuthContext";
import { useEffect, useState } from "react";
import { Group, useGroupContext } from "@/providers/GroupContext";
import { toast } from "sonner";
import ModifyGroupDialog from "./group/ModifyGroupDialog";
import CreateGroupForm from "./group/CreateGroupForm";
import AddMemberForm from "./group/AddMemberForm";
import DeleteMemberDialog from "./group/DeleteMemberDialog";
import AddPageForm from "./pages/AddPageForm";


const ContentSideBar = () => {
    const { user, token } = useAuth();
    const { selectedGroup, setSelectedPage, selectedGroupMembers, selectedGroupPages, setSelectedGroup } = useGroupContext();

    const [groups, setgroups] = useState<Group[]>([]);

    const setGroupsFromFetch = async () => {
        const API = import.meta.env.VITE_REACT_APP_API_URL
        try {
            const response = await fetch(API + "/group", {
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

            // Defaults to the first group, to never be empty
            if (json != null &&  json.length >= 1) {
                setSelectedGroup({
                    id: json[0].id,
                    groupName: json[0].groupName,
                    groupColor: json[0].groupColor,
                }) 
            } else {
                toast("Error fetching groups, or no group where found")
            }
            // setSelectedPage(groups[0].serverName)

        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error(error.message);
            }
        }
    }

    useEffect(() =>{
        setGroupsFromFetch();
    }, []);
    
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
                    <SidebarMenuButton size="lg" asChild className="md:h-8 md:p-0" tooltip={{children: "Home", hidden: false}}>
                        <Link to="/" className="flex aspect-square size-8 items-center justify-center rounded-lg">
                            <img src={logo} alt="Super Notes"/>
                        </Link>
                    </SidebarMenuButton>
                </SidebarHeader>

                <SidebarContent>
                    <SidebarGroup className="p-0">
                        {groups.map((item) => (
                            <div 
                                className={ selectedGroup?.id == item.id ? "bg-background-darker" : "bg-transparent"}
                            >
                                <SidebarMenuButton
                                    tooltip={{
                                        children: item.groupName,
                                        hidden: false,
                                    }}
                                    className=" text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg cursor-pointer"
                                    style={{backgroundColor: item.groupColor}}
                                    onClick={() => setSelectedGroup({
                                        id: item.id,
                                        groupName: item.groupName,
                                        groupColor: item.groupColor,
                                    })}
                                >
                                    <p>{item.groupName.substring(0,2)}</p>
                                </SidebarMenuButton>
                            </div>
                        ))}
                    </SidebarGroup>
                </SidebarContent>

                <SidebarFooter>
                    <CreateGroupForm/>

                    <SidebarMenuButton size="lg" asChild className="md:h-8 md:p-0 " tooltip={{children: "Go to " + user?.username + " account page", hidden: false,}}>
                        <Link to="/account" className="flex aspect-square size-8 items-center justify-center rounded-lg">
                            <div className="bg-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                                <img src={userIcon} alt={user?.username + " account"}/>
                            </div>
                        </Link>
                    </SidebarMenuButton>
                </SidebarFooter>
            </Sidebar>



            <Sidebar collapsible="none" className="hidden flex-1 md:flex">
                <SidebarHeader className="gap-1 border-b pl-4 pr-4 ">
                    <div className="flex w-full items-center justify-center m-0 p-0">
                        {selectedGroup?.groupName}
                        <ModifyGroupDialog/>
                    </div>
                    <SidebarInput placeholder="Type to search..." />
                </SidebarHeader>

                <SidebarContent>
                    <SidebarGroup className="px-0">
                        <SidebarGroupLabel>Pages</SidebarGroupLabel>
                        <SidebarGroupContent>
                            {selectedGroupPages.map((page) => (
                                <SidebarMenuItem key={page.id} className="list-none m-0 p-0 mb-0">
                                    <SidebarMenuButton 
                                        className="m-0 p-0" 
                                        tabIndex={-1}
                                        onClick={() => {setSelectedPage(page)}}
                                    >
                                        <Link
                                            to={"/page"} 
                                            onClick={() => {setSelectedPage(page)}}
                                            className="p-2 w-full text-foreground no-underline"
                                        >
                                            <p>{"•  " + page.pageName}</p> 
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                            <AddPageForm/>
                        </SidebarGroupContent>
                    </SidebarGroup>
                    <SidebarGroup className="px-0">
                        <SidebarGroupLabel>Members</SidebarGroupLabel>
                        <SidebarGroupContent>
                            {selectedGroupMembers.map((member) => (
                                <DeleteMemberDialog username={member.username} groupID={selectedGroup?.id}/>
                            ))}
                            <AddMemberForm/>
                        </SidebarGroupContent>
                        
                    </SidebarGroup>
                </SidebarContent>

            </Sidebar>
        </Sidebar>
    )
}

export default ContentSideBar;
