import React, {Suspense} from "react";
import {Navigate, Route, Routes} from "react-router-dom";

const UserProfile = React.lazy(() => import("./UserProfile"));
const UserRegister = React.lazy(() => import("./UserRegister"));
const UserLogin = React.lazy(() => import("./UserLogin"));
const UserRecoveryPassword = React.lazy(() => import("./UserRecoveryPassword"));
const UserLogout = React.lazy(() => import("./UserLogout"));

export default function UserRouter() {
    return (
        <Suspense fallback={null}>
            <Routes>
                <Route path="profile" element={<UserProfile/>}/>

                <Route path="register" element={<UserRegister/>}/>

                <Route path="login" element={<UserLogin/>}/>

                <Route path="recovery" element={<UserRecoveryPassword/>}/>

                <Route path="logout" element={<UserLogout/>}/>

                <Route element={<Navigate to="/"/>}/>
            </Routes>
        </Suspense>
    );
}
