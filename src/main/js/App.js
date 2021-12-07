import React, {useEffect} from "react";
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import Header from "./Header";
import ContestRouter from "./contest/ContestRouter";
import TaskRouter from "./task/TaskRouter";
import UserRouter from "./user/UserRouter";
import Footer from "./Footer";
import {tryGetCredentials, UserProvider, useUser} from "./Authorization";
import {CookiesProvider} from "react-cookie";
import LanguageRouter from "./language/LanguageRouter";
import ReportRouter from "./report/ReportRouter";

export default () => (<CookiesProvider><UserProvider><App/></UserProvider></CookiesProvider>);

function App() {
    let user = useUser();
    useEffect(() => tryGetCredentials(user), []);
    return (
        <div className="d-flex flex-column min-vh-100">
            <BrowserRouter basename="/">
                <Header/>
                <div className="pt-3 pb-3">
                    <Routes>
                        <Route path="contest/*" element={<ContestRouter/>}/>

                        <Route path="task/*" element={<TaskRouter/>}/>

                        <Route path="user/*" element={<UserRouter/>}/>

                        <Route path="language/*" element={<LanguageRouter/>}/>

                        <Route path="report/*" element={<ReportRouter/>}/>

                        <Route path="*" element={<Navigate to="/contest/"/>}/>
                    </Routes>
                </div>
                <Footer/>
            </BrowserRouter>
        </div>
    );
}
