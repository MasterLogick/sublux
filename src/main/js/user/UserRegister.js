import React, {useState} from "react";
import {useHistory} from "react-router-dom";
import {registerUser} from "../Authorization";
import {Alert, Button, Container, Form} from "react-bootstrap";

export default function UserRegister() {
    let username = React.createRef();
    let mail = React.createRef();
    let password = React.createRef();
    let passwordRepetition = React.createRef();
    let history = useHistory();
    let [globalValidationErrors, setGlobalValidationErrors] = useState([]);
    const [usernameValidationError, setUsernameValidationError] = useState(null);
    const [mailValidationError, setMailValidationError] = useState(null);
    const [passwordValidationError, setPasswordValidationError] = useState(null);
    const [passwordRepetitionValidationError, setPasswordRepetitionValidationError] = useState(null);

    function onSubmit(event) {
        event.preventDefault();
        event.stopPropagation();
        setGlobalValidationErrors([]);
        globalValidationErrors = [];
        setUsernameValidationError(null);
        setMailValidationError(null);
        setPasswordValidationError(null);
        setPasswordRepetitionValidationError(null);

        registerUser(username.current.value, mail.current.value, password.current.value, passwordRepetition.current.value)
            .then(() => history.goBack())
            .catch(errors => {
                for (const validationError of errors) {
                    switch (validationError.objectName) {
                        case "GLOBAL":
                            globalValidationErrors.push(validationError.message);
                            setGlobalValidationErrors(globalValidationErrors);
                            break;
                        case "username":
                            setUsernameValidationError(validationError.message);
                            break;
                        case "mail":
                            setMailValidationError(validationError.message);
                            break;
                        case "password":
                            setPasswordValidationError(validationError.message);
                            break;
                        case "passwordRepetition":
                            setPasswordRepetitionValidationError(validationError.message);
                            break;
                    }
                }
            });
    }

    return (<Container>
        <Form noValidate onSubmit={onSubmit}>
            {(() => globalValidationErrors.map((error, key) => <Alert key={key} variant={"danger"}>{error}</Alert>))()}
            <Form.Group className="mb-3" controlId="formUsername">
                <Form.Label>Username</Form.Label>
                <Form.Control type="text" placeholder="Enter username" name="username" ref={username}
                              isInvalid={usernameValidationError !== null}/>
                <Form.Control.Feedback type={"invalid"}>{usernameValidationError}</Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formMail">
                <Form.Label>Mail</Form.Label>
                <Form.Control type="mail" placeholder="Enter mail" name="mail" ref={mail}
                              isInvalid={mailValidationError !== null}/>
                <Form.Control.Feedback type={"invalid"}>{mailValidationError}</Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" placeholder="Enter password" name="password" ref={password}
                              isInvalid={passwordValidationError !== null}/>
                <Form.Control.Feedback type={"invalid"}>{passwordValidationError}</Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formRepeatPassword">
                <Form.Label>Repeat password</Form.Label>
                <Form.Control type="password" placeholder="Enter password again" name="password"
                              ref={passwordRepetition} isInvalid={passwordRepetitionValidationError !== null}/>
                <Form.Control.Feedback type={"invalid"}>{passwordRepetitionValidationError}</Form.Control.Feedback>
            </Form.Group>
            <Form.Group>
                <Button type="submit" variant="dark">Register</Button>
            </Form.Group>
        </Form>
    </Container>);
}