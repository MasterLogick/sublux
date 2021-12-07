import React, {Suspense} from "react";
import {Redirect, Route, Switch} from "react-router-dom";

const ReportInfo = React.lazy(() => import("./ReportInfo"));

export default function ReportRouter(props) {
    return (
        <Suspense fallback={null}>
            <Switch>
                <Route path={`${props.match.path}:id`}
                       component={ReportInfo}/>

                <Route><Redirect to={"/"}/></Route>
            </Switch>
        </Suspense>
    );
}
