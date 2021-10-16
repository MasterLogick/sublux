import React, {useState} from "react";
import {Link, Redirect, Route, Switch, useHistory, useLocation} from "react-router-dom";
import {Alert, Button, Col, Container, Form, NavDropdown, Row, Stack, Table} from "react-bootstrap";
import {authUser, isLogged, logoutUser, RequireAuthorized, useUser} from "./Authorization";

export {UserHeaderDropdown};
export default function User(props) {
    return (
        <Switch>
            <Route path={`${props.match.path}profile`} exact component={UserProfile}/>
            <Route path={`${props.match.path}register`} exact component={UserRegister}/>
            <Route path={`${props.match.path}login`} exact component={UserLogin}/>
            <Route path={`${props.match.path}recovery`} exact component={UserRecoveryPassword}/>
            <Route path={`${props.match.path}logout`} exact component={UserLogout}/>
            <Route><Redirect to={"/"}/></Route>
        </Switch>
    );
}

function UserProfile() {
    let user = useUser();
    return (<Container>
        <RequireAuthorized/>
        <Stack direction={"horizontal"} gap={3}>
            <h2 className={"align-self-end mb-0"}>
                {user.username}
            </h2>
            <h6 className={"text-muted align-self-end"} style={{marginBottom: ".18rem"}}>
                {`${user.first_name} ${user.last_name}`}
            </h6>
        </Stack>
        <hr/>
        <Table borderless>
            <tbody>
            <tr>
                <td className="col-3">Description:</td>
                <td>{user.description}</td>
            </tr>
            <tr>
                <td>Mail:</td>
                <td>
                    {user.mail}
                </td>
            </tr>
            </tbody>
        </Table>
    </Container>);
}

function UserRegister() {
    let username = React.createRef();
    let mail = React.createRef();
    let password = React.createRef();
    let passwordRepetition = React.createRef();

    function onSubmit(event) {
        event.preventDefault();
        event.stopPropagation();

        registerUser(username.current.value, mail.current.value, password.current.value, passwordRepetition.current.value)
            .then(() => {
            })
            .catch((error) => {
            });
    }

    return (<Container>
        <Form noValidate onSubmit={onSubmit}>
            {/*{(() => {
                if (badCredentials) {
                    return <Alert variant={"danger"}>{reason}</Alert>;
                } else {
                    return <></>;
                }
            })()}*/}
            <Form.Group className="mb-3" controlId="formUsername">
                <Form.Label>Username</Form.Label>
                <Form.Control type="text" placeholder="Enter username" name="username" ref={username}/>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formMail">
                <Form.Label>Mail</Form.Label>
                <Form.Control type="mail" placeholder="Enter mail" name="mail" ref={mail}/>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" placeholder="Enter password" name="password" ref={password}/>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formRepeatPassword">
                <Form.Label>Repeat password</Form.Label>
                <Form.Control type="password" placeholder="Enter password again" name="password"
                              ref={passwordRepetition}/>
            </Form.Group>
            <Form.Group>
                <Button type="submit" variant="dark">Register</Button>
            </Form.Group>
        </Form>
    </Container>);
}

function UserLogin() {
    let username = React.createRef();
    let password = React.createRef();
    const [badCredentials, setBadCredentials] = useState(false);
    const [reason, setReason] = useState("");
    const [validated, setValidated] = useState(false);
    const [usernameInvalid, setUsernameInvalid] = useState(false);
    const [passwordInvalid, setPasswordInvalid] = useState(false);

    let history = useHistory();
    let location = useLocation();
    let user = useUser();

    function onSubmit(event) {
        event.preventDefault();
        event.stopPropagation();
        let valid = true;
        if (username.current === null || username.current.value === "") {
            setUsernameInvalid(true);
            valid = false;
        } else {
            setUsernameInvalid(false);
        }
        if (password.current === null || password.current.value === "") {
            setPasswordInvalid(true);
            valid = false;
        } else {
            setPasswordInvalid(false);
        }
        if (!valid) {
            setValidated(false);
            return;
        }
        authUser(user, username.current.value, password.current.value).then(() => {
            let {redirect} = location.state || {redirect: {pathname: "/context"}};
            history.replace(redirect);
        }).catch((err) => {
            setBadCredentials(true);
            if (typeof err === "string" || err instanceof String) {
                setReason(err);
            } else {
                setReason((err.status === 401) ? "Bad credentials" : `Error: ${err.status}`);
            }
            password.current.value = "";
        });
    }

    return (
        <Container>
            <Form noValidate validated={validated} onSubmit={onSubmit}>
                {(() => {
                    if (badCredentials) {
                        return <Alert variant={"danger"}>{reason}</Alert>;
                    } else {
                        return <></>;
                    }
                })()}
                <Form.Group className="mb-3" as={Col} controlId="formUsername">
                    <Form.Label>Username</Form.Label>
                    <Form.Control required type="text" placeholder="Enter username" name="username" ref={username}
                                  isInvalid={usernameInvalid}/>
                    <Form.Control.Feedback type={"invalid"}>Please enter username</Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control required type="password" placeholder="Enter password" name="password" ref={password}
                                  isInvalid={passwordInvalid}/>
                    <Form.Control.Feedback type={"invalid"}>Please enter password</Form.Control.Feedback>
                </Form.Group>
                <Row>
                    <Col className={"col-6"}>
                        <Stack direction={"horizontal"} gap={3}>
                            <Form.Group>
                                <Button type="submit" variant="dark">Log in</Button>
                            </Form.Group>
                            <Link to={"/user/register"}>Register</Link>
                            <Link to={"/user/recovery"}>Forgot password?</Link>
                        </Stack>
                    </Col>
                </Row>

            </Form>
        </Container>
    );
}

function UserRecoveryPassword() {
    return null;
}

function UserLogout() {
    let user = useUser();
    logoutUser(user).catch(err => alert(err));
    return <Redirect to={"/"}/>;
}

function UserHeaderDropdown() {
    let user = useUser();
    if (isLogged(user))
        return (
            <NavDropdown id={"header-nav-menu-dropdown"} title={user.username} align={"end"}>
                <NavDropdown.Item>
                    <Link to={"/user/profile"} className={"nav-link bg-transparent text-dark"}>Profile</Link>
                </NavDropdown.Item>
                <NavDropdown.Divider/>
                <NavDropdown.Item>
                    <Link to={"/user/logout"} className={"nav-link bg-transparent text-dark"}>Log out</Link>
                </NavDropdown.Item>
            </NavDropdown>
        );
    else
        return (
            <Link to={"/user/login"} className={"nav-link"}>Log in</Link>
        )
}