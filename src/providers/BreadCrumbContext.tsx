import { createContext, ReactNode, useContext, useState } from "react"

export interface Group {
    id: string;
    groupName: string;
    groupColor: string;
}

interface BreadCrumbContextType {
  selectedGroup: Group | null;
  setSelectedGroup: (token: Group | null) => void;
  selectedPage: string | null;
  setSelectedPage: (token: string | null) => void;
}

const BreadCrumbContext = createContext<BreadCrumbContextType | undefined>(undefined);

interface BreadCrumbProviderProps {
  children: ReactNode;
}

export const BreadCrumbProvider: React.FC<BreadCrumbProviderProps> = ({ children }) => {
    
    const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);

    const [selectedPage, setSelectedPage] = useState<string | null>(null);

    const contextValue: BreadCrumbContextType = {
        selectedGroup,
        setSelectedGroup,
        selectedPage,
        setSelectedPage,
    };

    return (
        <BreadCrumbContext.Provider value={contextValue}>
            {children}
        </BreadCrumbContext.Provider>
    );
}

export const useBreadCrumb = () => {
    const context = useContext(BreadCrumbContext);
    if (context === undefined) {
        throw new Error('useBreadCrumb must be used within an AuthProvider');
    }
    return context;
};

export default BreadCrumbProvider;