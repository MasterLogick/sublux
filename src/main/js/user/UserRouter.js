import React, {Suspense} from "react";
import {Redirect, Route, Switch} from "react-router-dom";

const UserProfile = React.lazy(() => import("./UserProfile"));
const UserRegister = React.lazy(() => import("./UserRegister"));
const UserLogin = React.lazy(() => import("./UserLogin"));
const UserRecoveryPassword = React.lazy(() => import("./UserRecoveryPassword"));
const UserLogout = React.lazy(() => import("./UserLogout"));

export default function UserRouter(props) {
    return (
        <Suspense fallback={null}>
            <Switch>
                <Route path={`${props.match.path}profile`} exact
                       component={UserProfile}/>

                <Route path={`${props.match.path}register`} exact
                       component={UserRegister}/>

                <Route path={`${props.match.path}login`} exact
                       component={UserLogin}/>

                <Route path={`${props.match.path}recovery`} exact
                       component={UserRecoveryPassword}/>

                <Route path={`${props.match.path}logout`} exact
                       component={UserLogout}/>

                <Route><Redirect to={"/"}/></Route>
            </Switch>
        </Suspense>
    );
}
