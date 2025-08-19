import React, { createContext, useContext, useMemo } from 'react';
import { AxiosInstance } from 'axios';
import { useAuth } from './AuthContext'; // Votre hook pour l'authentification
import { setupAxiosClient } from '@/utils/axiosClient';

const AxiosContext = createContext<AxiosInstance | null>(null);

export const AxiosContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const API = import.meta.env.VITE_REACT_APP_API_URL;
    const { logout, token } = useAuth(); 

    const apiClient = useMemo(() => setupAxiosClient(token, logout, API), [token, logout]);

    return (
        <AxiosContext.Provider value={apiClient}>
            {children}
        </AxiosContext.Provider>
    );
};

export const useAxiosClient = () => {
    const context = useContext(AxiosContext);
    if (!context) {
        throw new Error('useAxiosClient must be used within an AxiosContextProvider');
    }
    return context;
};