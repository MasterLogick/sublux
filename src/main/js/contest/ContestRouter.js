import React, {Suspense} from "react";
import {Redirect, Route, Switch} from "react-router-dom";

export default function ContestRouter(props) {
    return (
        <Suspense fallback={null}>
            <Switch>
                <Route path={`${props.match.path}`} exact
                       component={React.lazy(() => import("./ContestList"))}/>

                <Route path={`${props.match.path}create`} exact
                       component={React.lazy(() => import("./ContestCreateForm"))}/>

                <Route path={`${props.match.path}:id`}
                       component={React.lazy(() => import("./ContestInfo"))}/>

                <Route><Redirect to={"/"}/></Route>
            </Switch>
        </Suspense>);
}