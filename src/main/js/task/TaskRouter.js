import React, {Suspense} from "react";
import {Redirect, Route, Switch} from "react-router-dom";


export default function TaskRouter(props) {
    return (
        <Suspense fallback={null}>
            <Switch>
                <Route path={`${props.match.path}create`} exact
                       component={React.lazy(() => import("./TaskCreateForm"))}/>

                <Route path={`${props.match.path}:id`}
                       component={React.lazy(() => import("./TaskFullView"))}/>

                <Route><Redirect to={"/"}/></Route>
            </Switch>
        </Suspense>
    );
}

