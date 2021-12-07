import React, {Suspense} from "react";
import {Navigate, Route, Routes} from "react-router-dom";

const LanguageCreateForm = React.lazy(() => import("./LanguageCreateForm"))
const LanguageList = React.lazy(() => import("./LanguageList"))
const LanguageInfo = React.lazy(() => import("./LanguageInfo"))

export default function LanguageRouter() {
    return (
        <Suspense fallback={null}>
            <Routes>
                <Route path="/" element={<LanguageList/>}/>

                <Route path="create" element={<LanguageCreateForm/>}/>

                <Route path=":id" element={<LanguageInfo/>}/>

                <Route element={<Navigate to="/"/>}/>
            </Routes>
        </Suspense>
    );
}
