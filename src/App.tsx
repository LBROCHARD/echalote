import { BrowserRouter, Route, Routes } from "react-router-dom"
import Layout from "./layout/Layout";
import NotFoundPage from "./pages/NotFoundPage";
import MainContent from "./components/MainContent";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AccountComponent from "./components/AccountComponent";

function App() {

    return (
        <BrowserRouter>
            <Routes>    
                <Route path="/" element={<Layout/>}>
                    <Route path="/" element={<p>main page</p>}></Route>
                    <Route path="/page" element={<MainContent/>}></Route>
                    <Route path="/account" element={<AccountComponent/>}></Route>
                </Route>
                <Route path="/login" element={<LoginPage/>}></Route>
                <Route path="/register" element={<RegisterPage/>}></Route>
                <Route path="*" element={<NotFoundPage/>}></Route>
            </Routes>
        </BrowserRouter>
    )
}

export default App;
