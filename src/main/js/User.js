import React from "react";
import {Redirect, Route, Switch} from "react-router-dom";
import {Alert, Button, Container, Form} from "react-bootstrap";
import axios from "axios";
import {checkAuthorization} from "./Authorization";

export default function User(props) {
    return (
        <Switch>
            <Route path={`${props.match.path}profile`} exact component={UserProfile}/>
            <Route path={`${props.match.path}register`} exact component={UserRegisterForm}/>
            <Route path={`${props.match.path}login`} exact component={UserLoginForm}/>
            <Route><Redirect to={"/"}/></Route>
        </Switch>
    );
}

class UserProfile extends React.Component {
    render() {
        return (<>Profile</>);
    }
}

class UserRegisterForm extends React.Component {
    render() {
        return (<>Register</>);
    }
}

class UserLoginForm extends React.Component {
    constructor(props) {
        super(props);
        this.onSubmit = this.onSubmit.bind(this);
        this.state = {
            badCredentials: false,
            reason: ""
        };
        this.username = React.createRef();
        this.password = React.createRef();
    }

    readCookie(name) {
        name += '=';
        let ca = document.cookie.split(/;\s*/), i = ca.length - 1;
        for (; i >= 0; i--)
            if (!ca[i].indexOf(name))
                return ca[i].replace(name, '');
    }

    onSubmit(event) {
        event.preventDefault();
        event.stopPropagation();
        const params = new URLSearchParams();
        params.append('username', this.username.current.value);
        params.append('password', this.password.current.value);
        axios.post("/api/user/login", params, {
            headers: {
                "X-XSRF-TOKEN": this.readCookie("XSRF-TOKEN"),
                "Content-Type": "application/x-www-form-urlencoded"
            }
        }).then(() => {
            this.props.history.push(new URLSearchParams(this.props.location.search)?.get("r") || "/contest");
            checkAuthorization();
        }).catch((err) => {
            this.setState({
                badCredentials: true,
                reason: (err.response.status === 401) ? "Bad credentials" : `Error: ${err.response.status}`
            });
            this.password.current.value = "";
            checkAuthorization();
        })
    }

    render() {
        return (
            <Container>
                <Form noValidate onSubmit={this.onSubmit}>
                    {(() => {
                        if (this.state.badCredentials) {
                            return <Alert variant={"danger"}>{this.state.reason}</Alert>;
                        } else {
                            return <></>;
                        }
                    })()}
                    <Form.Group className="mb-3" controlId="formUsername">
                        <Form.Label>Username</Form.Label>
                        <Form.Control type="text" placeholder="Enter username" name="username" ref={this.username}/>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" placeholder="Enter password" name="password" ref={this.password}/>
                    </Form.Group>
                    <Form.Group>
                        <Button type="submit" variant="dark">Submit form</Button>
                    </Form.Group>
                </Form>
            </Container>
        );
    }
}