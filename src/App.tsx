import { BrowserRouter, Route, Routes } from "react-router-dom"
import Layout from "./layout/Layout";
import ConnexionPage from "./pages/ConnexionPage";
import NotFoundPage from "./pages/NotFoundPage";
import MainContent from "./components/MainContent";

function App() {

    return (
        <BrowserRouter>
            <Routes>    
                <Route path="/" element={<Layout/>}>
                    <Route path="/" element={<p>main page</p>}></Route>
                    <Route path="/page" element={<MainContent/>}></Route>
                    <Route path="/account" element={<p>account</p>}></Route>
                </Route>
                <Route path="/connexion" element={<ConnexionPage/>}></Route>
                <Route path="*" element={<NotFoundPage/>}></Route>
            </Routes>
        </BrowserRouter>
    )
}

export default App;
