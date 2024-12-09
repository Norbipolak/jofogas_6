import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./styles/style.scss";
import Nav from ".components/Nav";
import HomePage from "./pages/public/HomePage";
import RegisterPage from "./pages/public/RegisterPage";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faCircleXMark, faSquareCheck } from "@fortawesome/free-solid-svg-icons";
library.add(
    faCircleXMark, faSquareCheck
)
/*
    Itt 3 dolog ami, fontos a fontawesome-nál 
    1. kell egy { library } 
    2. import { faCircleXMark } from "@fortawesome/free-solid-svg-icons"; - hogy solid vagy a másik 
    3. library.add()-ban pedig fel kell sorolni az összes ikont, amiket használtunk 
*/

function App() {
    return(
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Nav/>}>
                    <Route index element={<HomePage/>}/>
                    <Route path={"/regisztracio"} element={<RegisterPage/>}/>
                    <Route path={"/activate-registration/:activationString/:userID"} element={<ActivateRegistration/>}/>
                </Route>
            </Routes>
        </BrowserRouter>
    );
}  

export default App;
