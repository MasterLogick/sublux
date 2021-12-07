import React, {useEffect} from "react";
import {BrowserRouter, Redirect, Route, Switch} from "react-router-dom";
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
            <BrowserRouter basename={"/"}>
                <Header/>
                <div className="pt-3 pb-3">
                    <Switch>
                        <Route path="/contest/" component={ContestRouter}/>
                        <Route path="/task/" component={TaskRouter}/>
                        <Route path="/user/" component={UserRouter}/>
                        <Route path="/language/" component={LanguageRouter}/>
                        <Route path="/report/" component={ReportRouter}/>
                        <Route><Redirect to={"/contest/"}/></Route>
                    </Switch>
                </div>
                <Footer/>
            </BrowserRouter>
        </div>
    );
}
