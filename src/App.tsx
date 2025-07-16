import { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom"
import MainPage from "./pages/MainPage";
import ConnexionPage from "./pages/ConnexionPage";
import NotFoundPage from "./pages/NotFoundPage";

function App() {

    const [token, setToken] = useState("");

    useEffect(() => {}, [token]);

    return (
        <BrowserRouter>
            <Routes>    
                <Route path="/" element={<MainPage token={token}/>}>
                    <Route path="/page" element={<p>page</p>}></Route>
                    <Route path="/account" element={<p>account</p>}></Route>
                </Route>
                <Route path="/connexion" element={<ConnexionPage setToken={setToken}/>}></Route>
                <Route path="*" element={<NotFoundPage/>}></Route>
            </Routes>
        </BrowserRouter>
    )
}

export default App;
