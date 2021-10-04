import React from "react";
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import Header from "./Header";
import {ContestList} from "./Contest";
import {TaskList} from "./Task";
import {UserView} from "./User";
import Footer from "./Footer";

export default function App() {
    return (<div className="d-flex flex-column min-vh-100">
        <Router>
            <Header/>
            <Switch>
                <Route path="/" exact component={ContestList}/>
                <Route path="/contest" component={ContestList}/>
                <Route path="/task" component={TaskList}/>
                <Route path="/user" component={UserView}/>
                <Route component={ContestList}/>
            </Switch>
            <Footer/>
        </Router>
    </div>);
}
