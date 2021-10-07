import React from "react";
import {Container} from "react-bootstrap";
import {Redirect} from "react-router-dom";
import axios from "axios";

export {isAuthorized, checkAuthorization, Unauthorized}
let user = null;

function isAuthorized() {
    return user !== null;
}

function checkAuthorization() {
    axios.get("/api/user/me").then((response) => {
        user = response.data;
    }).catch(() => {
        user = null;
    })
}

function Unauthorized(props) {
    return (<Container>
        <h2>You are not authorized</h2>
        <Redirect to={`/user/login?r=${props.return}`}/>
    </Container>);
}
