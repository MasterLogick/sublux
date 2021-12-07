import React, {useContext, useState} from "react";
import axios from "axios";
import {Navigate} from "react-router-dom";
import {useCookies} from "react-cookie";

export {UserProvider, useUser, tryGetCredentials, authUser, RequireAuthorized, isLogged, logoutUser, registerUser}

const UserContext = React.createContext({});

function RequireAuthorized() {
    let user = useUser();
    if (!isLogged(user)) {
        return <Navigate to="/user/login"/>
    } else {
        return null;
    }
}

function invalidateUser(user) {
    user.unsafe_setCookies("user", {});
    user.unsafe_setUser({})
}

function loadUser(user, data) {
    const userData = {
        id: data.id,
        username: data.username,
        first_name: data.first_name,
        last_name: data.last_name,
        mail: data.mail,
        description: data.description
        //todo mb add teams info
    };
    user.unsafe_setCookies("user", userData)
    user.unsafe_setUser(userData);
}

function readCookie(name) {
    name += '=';
    let ca = document.cookie.split(/;\s*/), i = ca.length - 1;
    for (; i >= 0; i--)
        if (!ca[i].indexOf(name))
            return ca[i].replace(name, '');
    return "";
}

function tryGetCredentials(user) {
    axios.get("/api/user/me").then(resp => {
        loadUser(user, resp.data);
    }).catch(() => {
        invalidateUser(user);
    });
}

function authUser(user, username, password) {
    if (isLogged(user)) {
        return Promise.reject("Some user is already logged in. Log out first.");
    }
    return new Promise((resolve, reject) => {
        const params = new URLSearchParams();
        params.append('username', username);
        params.append('password', password);
        axios.post("/api/user/login", params, {
            headers: {
                "X-XSRF-TOKEN": readCookie("XSRF-TOKEN"),
                "Content-Type": "application/x-www-form-urlencoded"
            }
        }).then((response) => {
            loadUser(user, response.data);
            resolve();
        }).catch((err) => {
            invalidateUser(user);
            reject(err.response);
        })
    });
}

function registerUser(username, mail, password, passwordRepetition) {
    return new Promise((resolve, reject) => {
        const params = new URLSearchParams();
        params.append("username", username);
        params.append("mail", mail);
        params.append("password", password);
        params.append("passwordRepetition", passwordRepetition);
        axios.post("/api/user/register", params, {
            headers: {
                "X-XSRF-TOKEN": readCookie("XSRF-TOKEN"),
                "Content-Type": "application/x-www-form-urlencoded"
            }
        }).then(response => {
            resolve(response.data);
        }).catch(err => {
            reject(err.response.data.errorList);
        });
    });
}

function logoutUser(user) {
    if (!isLogged(user)) {
        return Promise.reject("No user to log out");
    }
    return new Promise((resolve, reject) =>
        axios.post("/api/user/logout", {}, {
            headers: {
                "X-XSRF-TOKEN": readCookie("XSRF-TOKEN"),
                "Content-Type": "application/x-www-form-urlencoded"
            }
        }).then(response => {
            invalidateUser(user);
            resolve(response.data);
        }).catch(err => {
            reject(err);
        }))
}

function UserProvider({children}) {
    const [cookies, setCookies] = useCookies(["user"]);
    if (cookies.user === undefined) {
        setCookies("user", {});
        cookies.user = {};
    }
    const [user, setUser] = useState(cookies.user);
    user.unsafe_setUser = setUser;
    user.unsafe_setCookies = setCookies;
    return (
        <UserContext.Provider value={user}>
            {children}
        </UserContext.Provider>
    )
}

function useUser() {
    return useContext(UserContext);
}

function isLogged(user) {
    return user?.username !== undefined;
}