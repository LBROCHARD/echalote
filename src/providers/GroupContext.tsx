import { createContext, ReactNode, useContext, useEffect, useState } from "react"
import { useAuth } from "./AuthContext";

export interface Group {
    id: string;
    groupName: string;
    groupColor: string;
}

export interface GroupMember {
    id: string;
    username: string;
    email: string;
}

export interface Page {
    id: string;
    pageName: string;
    pageColor: string;
    content: string;
    tags: string;
}

interface GroupContextType {
    selectedGroup: Group | null;
    setSelectedGroup: (token: Group | null) => void;
    selectedGroupMembers: GroupMember[];
    selectedGroupPages: Page[];

    selectedPage: Page | null;
    setSelectedPage: (token: Page | null) => void;
}

const GroupContext = createContext<GroupContextType | undefined>(undefined);

interface GroupContextProviderProps {
    children: ReactNode;
}

export const GroupContextProvider: React.FC<GroupContextProviderProps> = ({ children }) => {
    const {token} = useAuth();
    const API = import.meta.env.VITE_REACT_APP_API_URL
    
    const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);

    const [selectedGroupMembers, setSelectedGroupMembers] = useState<GroupMember[]>([]);
    const [selectedGroupPages, setSelectedGroupPages] = useState<Page[]>([]);

    const [selectedPage, setSelectedPage] = useState<Page | null>(null);

    const contextValue: GroupContextType = {
        selectedGroup,
        setSelectedGroup,
        selectedGroupMembers,
        selectedGroupPages,

        selectedPage,
        setSelectedPage,
    };

    useEffect(() => {
        console.log("selectedGroup or selectedPage changed !")
        getGroupMembers();
        getGroupPages();
    }, [selectedGroup, selectedPage]);


    const getGroupMembers = async () => {
        try {
            if (selectedGroup == null) {
                throw new Error(`No group selected`);
            }
            
            const response = await fetch(API + "/group/member/" + selectedGroup.id, {
                method: "get",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            });

            if (!response.ok ) {
                if ([401, 403].indexOf(response.status) !== -1) {
                    throw new Error(`Response status text: ${response.status}`);
                }
            }

            const json = await response.json();
            console.log("result : ", json);
            setSelectedGroupMembers(json);

        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error(error.message);
            }
        }
    } 

    const getGroupPages = async () => { 
        try {
            if (selectedGroup == null) {
                throw new Error(`No group selected`);
            }
            
            const response = await fetch(API + "/pages/from-group/" + selectedGroup.id, {
                method: "get",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            });

            if (!response.ok ) {
                if ([401, 403].indexOf(response.status) !== -1) {
                    throw new Error(`Response status text: ${response.status}`);
                }
            }

            const json = await response.json();
            console.log("result : ", json);
            setSelectedGroupPages(json);

        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error(error.message);
            }
        }
    }


    return (
        <GroupContext.Provider value={contextValue}>
            {children}
        </GroupContext.Provider>
    );
}

export const useGroupContext = () => {
    const context = useContext(GroupContext);
    if (context === undefined) {
        throw new Error('useGroupContext must be used within an GroupContextProvider');
    }
    return context;
};

export default GroupContext;