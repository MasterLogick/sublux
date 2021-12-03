import React, {Suspense} from "react";
import {Redirect, Route, Switch} from "react-router-dom";

export default function LanguageRouter(props) {
    return (
        <Suspense fallback={null}>
            <Switch>
                <Route path={`${props.match.path}create`} exact
                       component={React.lazy(() => import("./LanguageCreateForm"))}/>

                <Route path={`${props.match.path}`} exact
                       component={React.lazy(() => import("./LanguageList"))}/>

                <Route path={`${props.match.path}:id`}
                       component={React.lazy(() => import("./LanguageInfo"))}/>

                <Route><Redirect to={"/"}/></Route>
            </Switch>
        </Suspense>
    );
}
