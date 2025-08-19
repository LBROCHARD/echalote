import { BrowserRouter, Route, Routes } from "react-router-dom"
import Layout from "./layout/Layout";
import NotFoundPage from "./pages/NotFoundPage";
import MainContent from "./components/MainContent";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AccountComponent from "./components/AccountComponent";
import HomeComponent from "./components/HomeComponent";
import { useAuth } from "./providers/AuthContext";
import { setupAxiosClient } from "./utils/axiosClient";
import { AxiosContextProvider } from "./providers/AxiosContext";

function App() {
    const API = import.meta.env.VITE_REACT_APP_API_URL
    const { token, logout } = useAuth();
    const axiosClient = setupAxiosClient(token, logout, API);

    return (
        <AxiosContextProvider>
            <BrowserRouter>
                <Routes>    
                    <Route path="/" element={<Layout/>}>
                        <Route path="/" element={<HomeComponent/>}></Route>
                        <Route path="/page" element={<MainContent/>}></Route>
                        <Route path="/account" element={<AccountComponent/>}></Route>
                    </Route>
                    <Route path="/login" element={<LoginPage/>}></Route>
                    <Route path="/register" element={<RegisterPage/>}></Route>
                    <Route path="*" element={<NotFoundPage/>}></Route>
                </Routes>
            </BrowserRouter>
        </AxiosContextProvider>
    )
}

export default App;
