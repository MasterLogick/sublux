import React, {Suspense} from "react";
import {Redirect, Route, Switch} from "react-router-dom";

const TaskCreateForm = React.lazy(() => import("./TaskCreateForm"));
const TaskInfo = React.lazy(() => import("./TaskInfo"));

export default function TaskRouter(props) {
    return (
        <Suspense fallback={null}>
            <Switch>
                <Route path={`${props.match.path}create`} exact
                       component={TaskCreateForm}/>

                <Route path={`${props.match.path}:id`}
                       component={TaskInfo}/>

                <Route><Redirect to={"/"}/></Route>
            </Switch>
        </Suspense>
    );
}

