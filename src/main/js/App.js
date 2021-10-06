import React from "react";
import {BrowserRouter as Router, Redirect, Route, Switch} from "react-router-dom";
import Header from "./Header";
import Contest from "./Contest";
import Task from "./Task";
import User from "./User";
import Footer from "./Footer";

export default class App extends React.Component {
    render() {
        return (
            <div className="d-flex flex-column min-vh-100">
                <Router basename={"/"}>
                    <Header/>
                    <Switch>
                        <Route path="/" exact>
                            <Redirect to={"/contest/"}/>
                        </Route>
                        <Route path="/contest/" component={Contest}/>
                        <Route path="/task/" component={Task}/>
                        <Route path="/user/" component={User}/>
                        <Route><Redirect to={"/"}/></Route>
                    </Switch>
                    <Footer/>
                </Router>
            </div>);
    }
}
