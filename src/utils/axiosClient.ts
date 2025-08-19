import axios from 'axios';

// This is meant to intercept errors 498 and logout the user
export const setupAxiosClient = (token : string | null, logout: () => void, API: string) => {
    
    const axiosClient = axios.create({
        baseURL: API,
        headers: {
            'Content-Type': 'application/json',
        },
    });

    axiosClient.interceptors.request.use(
        (config) => {
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );

    axiosClient.interceptors.response.use(
        (response) => {
            return response;
        },
        (error) => {
            if (error.response?.status === 498) {
                console.error("Error 498: Expired token.");
                logout();
            }
            return Promise.reject(error);
        }
    );

    return axiosClient;
}