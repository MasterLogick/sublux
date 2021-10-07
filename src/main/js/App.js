import React from "react";
import {BrowserRouter, Redirect, Route, Switch} from "react-router-dom";
import Header from "./Header";
import Contest from "./Contest";
import Task from "./Task";
import User from "./User";
import Footer from "./Footer";

export default function App() {
    return (
        <div className="d-flex flex-column min-vh-100">
            <BrowserRouter basename={"/"}>
                <Header/>
                <div className="pt-3">
                    <Switch>
                        <Route path="/" exact>
                            <Redirect to={"/contest/"}/>
                        </Route>
                        <Route path="/contest/" component={Contest}/>
                        <Route path="/task/" component={Task}/>
                        <Route path="/user/" component={User}/>
                        <Route><Redirect to={"/"}/></Route>
                    </Switch>
                </div>
                <Footer/>
            </BrowserRouter>
        </div>);
}
