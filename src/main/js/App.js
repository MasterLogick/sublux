import React, {useEffect} from "react";
import {BrowserRouter, Redirect, Route, Switch} from "react-router-dom";
import Header from "./Header";
import Contest from "./Contest";
import Task from "./Task";
import User from "./User";
import Footer from "./Footer";
import {tryGetCredentials, UserProvider, useUser} from "./Authorization";
import {CookiesProvider} from "react-cookie";
import Language from "./Language";

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
                        <Route path="/contest/" component={Contest}/>
                        <Route path="/task/" component={Task}/>
                        <Route path="/user/" component={User}/>
                        <Route path="/language/" component={Language}/>
                        <Route><Redirect to={"/contest/"}/></Route>
                    </Switch>
                </div>
                <Footer/>
            </BrowserRouter>
        </div>
    );
}
