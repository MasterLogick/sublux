import React, {Suspense} from "react";
import {Navigate, Route, Routes} from "react-router-dom";

const ReportInfo = React.lazy(() => import("./ReportInfo"));

export default function ReportRouter() {
    return (
        <Suspense fallback={null}>
            <Routes>
                <Route path=":id" element={<ReportInfo/>}/>

                <Route element={<Navigate to="/"/>}/>
            </Routes>
        </Suspense>
    );
}
