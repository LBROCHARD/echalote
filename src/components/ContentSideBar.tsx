import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarInput, SidebarMenuButton, SidebarMenuItem, } from "@/components/ui/sidebar"
import logo from '/SuperNotes_icon.png';
import userIcon from '/User.png';
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "@/providers/AuthContext";
import { useEffect, useState } from "react";
import { Page, useGroupContext } from "@/providers/GroupContext";
import ModifyGroupDialog from "./group/ModifyGroupDialog";
import CreateGroupForm from "./group/CreateGroupForm";
import AddMemberForm from "./group/AddMemberForm";
import DeleteMemberDialog from "./group/DeleteMemberDialog";
import AddPageForm from "./pages/AddPageForm";
import SkipLink from "./SkipLink";
import AutoColorText from "./group/AutoColorText";


const ContentSideBar = () => {
    const { user } = useAuth();
    const { groups, rechargeUserGroups, selectedGroup, setSelectedPage, selectedGroupMembers, selectedGroupPages, setSelectedGroup } = useGroupContext();
    const navigate = useNavigate();

    const [searchInput, setSearchInput] = useState('');
    const [sortedPages, setSortedPages] = useState<Page[]>([]);

    useEffect(() =>{
        rechargeUserGroups();
        setSortedPages(selectedGroupPages);
    }, []);

    useEffect(() =>{
        setSortedPages(selectedGroupPages);
        searchInPages();
    }, [selectedGroupPages]);

    useEffect(() =>{
        searchInPages();
    }, [searchInput]);

    useEffect(() =>{
        setSearchInput("");
    }, [selectedGroup]);

    const searchInPages = () => {
        let sortedPages: Page[] = [];

        const normalizedSearchInput = searchInput.toLowerCase();

        selectedGroupPages.filter(page => {
            const normalizedPageName = page.pageName.toLowerCase();
            if (normalizedPageName.includes(normalizedSearchInput)) {
                sortedPages.push(page);
            }
        })

        // Add from tags as well
        selectedGroupPages.filter(page => {
            const normalizedPageTags = page.tags.toLowerCase();
            if (normalizedPageTags.includes(normalizedSearchInput) && !sortedPages.includes(page)) {
                sortedPages.push(page);
            }
        })
        
        setSortedPages(sortedPages);
    }
    
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
                            <img src={logo} alt="Logo Super Notes"/>
                        </Link>
                    </SidebarMenuButton>
                </SidebarHeader>

                <SidebarContent>
                    <SidebarGroup className="p-0">
                        {groups?.map((item) => (
                            <div 
                                key={item.id}
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
                                    <AutoColorText backgroundColor={item.groupColor} text={item.groupName.substring(0,2)}/>
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
                    <SidebarInput 
                        placeholder="Type to search..." 
                        value={searchInput}
                        onChange={(event) => setSearchInput(event.target.value)} 
                    />
                </SidebarHeader>

                <SidebarContent>
                    <SidebarGroup className="px-0">
                        <SidebarGroupLabel>Pages</SidebarGroupLabel>
                        <SkipLink/>
                        <SidebarGroupContent>
                            {sortedPages.map((page) => (
                                <SidebarMenuItem key={page.id} className="list-none m-0 p-0 mb-0">
                                    <SidebarMenuButton 
                                        className="m-0 p-0" 
                                        onClick={() => {
                                            setSelectedPage(page);
                                            navigate("/page")
                                        }}
                                    >
                                        <Link
                                            to={"/page"} 
                                            tabIndex={-1}
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
                                <DeleteMemberDialog key={member.id} username={member.username} groupID={selectedGroup?.id}/>
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
