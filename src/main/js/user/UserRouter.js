import React, {Suspense} from "react";
import {Redirect, Route, Switch} from "react-router-dom";

export default function UserRouter(props) {
    return (
        <Suspense fallback={null}>
            <Switch>
                <Route path={`${props.match.path}profile`} exact
                       component={React.lazy(() => import("./UserProfile"))}/>

                <Route path={`${props.match.path}register`} exact
                       component={React.lazy(() => import("./UserRegister"))}/>

                <Route path={`${props.match.path}login`} exact
                       component={React.lazy(() => import("./UserLogin"))}/>

                <Route path={`${props.match.path}recovery`} exact
                       component={React.lazy(() => import("./UserRecoveryPassword"))}/>

                <Route path={`${props.match.path}logout`} exact
                       component={React.lazy(() => import("./UserLogout"))}/>

                <Route><Redirect to={"/"}/></Route>
            </Switch>
            s</Suspense>
    );
}
