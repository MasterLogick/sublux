import React, {Suspense} from "react";
import {Redirect, Route, Switch} from "react-router-dom";

const LanguageCreateForm = React.lazy(() => import("./LanguageCreateForm"))
const LanguageList = React.lazy(() => import("./LanguageList"))
const LanguageInfo = React.lazy(() => import("./LanguageInfo"))

export default function LanguageRouter(props) {
    return (
        <Suspense fallback={null}>
            <Switch>
                <Route path={`${props.match.path}create`} exact
                       component={LanguageCreateForm}/>

                <Route path={`${props.match.path}`} exact
                       component={LanguageList}/>

                <Route path={`${props.match.path}:id`}
                       component={LanguageInfo}/>

                <Route><Redirect to={"/"}/></Route>
            </Switch>
        </Suspense>
    );
}
