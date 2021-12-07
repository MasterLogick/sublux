import React, {Suspense} from "react";
import {Navigate, Route, Routes} from "react-router-dom";

const TaskCreateForm = React.lazy(() => import("./TaskCreateForm"));
const TaskInfo = React.lazy(() => import("./TaskInfo"));

export default function TaskRouter() {
    return (
        <Suspense fallback={null}>
            <Routes>
                <Route path="create" element={<TaskCreateForm/>}/>

                <Route path=":id" element={<TaskInfo/>}/>

                <Route element={<Navigate to="/"/>}/>
            </Routes>
        </Suspense>
    );
}

