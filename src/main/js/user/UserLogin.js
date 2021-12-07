import React, {useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {authUser, useUser} from "../Authorization";
import {Alert, Button, Col, Container, Form, Row, Stack} from "react-bootstrap";

export default function UserLogin() {
    let username = React.createRef();
    let password = React.createRef();
    const [badCredentials, setBadCredentials] = useState(false);
    const [reason, setReason] = useState("");
    const [validated, setValidated] = useState(false);
    const [usernameInvalid, setUsernameInvalid] = useState(false);
    const [passwordInvalid, setPasswordInvalid] = useState(false);

    let navigate = useNavigate();
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
            navigate(-1);
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
                    if (badCredentials)
                        return <Alert variant={"danger"}>{reason}</Alert>;
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