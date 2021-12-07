import React, {Suspense} from "react";
import {Navigate, Route, Routes} from "react-router-dom";

const ContestList = React.lazy(() => import("./ContestList"));
const ContestCreateForm = React.lazy(() => import("./ContestCreateForm"));
const ContestInfo = React.lazy(() => import("./ContestInfo"));

export default function ContestRouter() {
    return (
        <Suspense fallback={null}>
            <Routes>
                <Route path="/" element={<ContestList/>}/>

                <Route path="create" element={<ContestCreateForm/>}/>

                <Route path=":id" element={<ContestInfo/>}/>

                <Route element={<Navigate to="/"/>}/>
            </Routes>
        </Suspense>);
}