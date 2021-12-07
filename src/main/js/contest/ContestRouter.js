import React, {Suspense} from "react";
import {Redirect, Route, Switch} from "react-router-dom";

const ContestList = React.lazy(() => import("./ContestList"));
const ContestCreateForm = React.lazy(() => import("./ContestCreateForm"));
const ContestInfo = React.lazy(() => import("./ContestInfo"));

export default function ContestRouter(props) {
    return (
        <Suspense fallback={null}>
            <Switch>
                <Route path={`${props.match.path}`} exact
                       component={ContestList}/>

                <Route path={`${props.match.path}create`} exact
                       component={ContestCreateForm}/>

                <Route path={`${props.match.path}:id`}
                       component={ContestInfo}/>

                <Route><Redirect to={"/"}/></Route>
            </Switch>
        </Suspense>);
}