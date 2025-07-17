import { createContext, ReactNode, useContext, useEffect, useState } from "react"

interface User {
    email: string,
    username: string
}

interface AuthContextType {
  token: string | null;
  setToken: (token: string | null) => void;
  user: User | null;
  setUser: (user: User | null) => void;
  isAuthenticated: boolean;
  login: (newToken: string, user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);


interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    
    const [token, setTokenState] = useState<string | null>(() => {
        return localStorage.getItem('authToken');
    });

    const [user, setUserState] = useState<User | null>(() => {
        try {
            const storedUser = localStorage.getItem('authUser');
            return storedUser ? JSON.parse(storedUser) : null;
        } catch (error) {
            console.error("Failed to parse stored user data:", error);
            return null;
        }
    });

    useEffect(() => {
        if (token) {
            localStorage.setItem('authToken', token);
        } else {
            localStorage.removeItem('authToken');
        }
    }, [token]);

    useEffect(() => {
        if (user) {
            localStorage.setItem('authUser', JSON.stringify(user));
        } else {
            localStorage.removeItem('authUser');
        }
    }, [user]);


    const login = (newToken: string, userData: User) => {
        setTokenState(newToken);
        setUserState(userData);
    };

    const logout = () => {
        setTokenState(null);
        setUserState(null);
    };

    const isAuthenticated = !!token;

    const contextValue: AuthContextType = {
        token,
        setToken: setTokenState,
        user,
        setUser: setUserState,
        isAuthenticated,
        login,
        logout,
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthProvider;


export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
