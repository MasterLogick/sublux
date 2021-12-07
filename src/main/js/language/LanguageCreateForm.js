import React, {useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import axios from "axios";
import {Button, Container, Form} from "react-bootstrap";
import {RequireAuthorized} from "../Authorization";

export default function LanguageCreateForm() {
    let name = React.createRef();
    let dockerTar = React.createRef();
    let buildScript = React.createRef();
    let runScript = React.createRef();
    const [nameValidationError, setNameValidationError] = useState(null);
    const [dockerTarValidationError, setDockerTarValidationError] = useState(null);
    const [buildScriptValidationError, setBuildScriptValidationError] = useState(null);
    const [runScriptValidationError, setRunScriptValidationError] = useState(null);

    let navigate = useNavigate();

    function onSubmit(event) {
        event.preventDefault();
        event.stopPropagation();
        setNameValidationError(null);
        setDockerTarValidationError(null);
        setBuildScriptValidationError(null);
        setRunScriptValidationError(null);
        let valid = true;
        if (dockerTar.current.files.length === 0) {
            setDockerTarValidationError("Select tar archive for docker image build");
            valid = false;
        }
        if (buildScript.current.files.length === 0) {
            setBuildScriptValidationError("Select build script file");
            valid = false;
        }
        if (runScript.current.files.length === 0) {
            setRunScriptValidationError("Select run script file");
            valid = false;
        }
        if (!valid) return;
        let form = new FormData();
        form.append("name", name.current.value);
        form.append("dockerTar", dockerTar.current.files[0]);
        form.append("buildScript", buildScript.current.files[0]);
        form.append("runScript", runScript.current.files[0]);
        axios.post("/api/language/create", form).then(() => navigate("/language")).catch(err => {
            for (const error of err.response.data.errorList) {
                switch (error.objectName) {
                    case "name":
                        setNameValidationError(error.message);
                        break;
                    case "dockerTar":
                        setDockerTarValidationError(error.message);
                        break;
                    case "buildScript":
                        setBuildScriptValidationError(error.message);
                        break;
                    case "runScript":
                        setRunScriptValidationError(error.message);
                        break;
                }
            }
        });
    }

    return (
        <Container>
            <RequireAuthorized/>
            <h3>Create new language</h3>
            <Form noValidate onSubmit={onSubmit}>
                <Form.Group className="mb-3" controlId="formName">
                    <Form.Label>Name</Form.Label>
                    <Form.Control type="text" placeholder="Enter name" name="name" ref={name}
                                  isInvalid={nameValidationError !== null}/>
                    <Form.Control.Feedback type={"invalid"}>{nameValidationError}</Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formDockerTarScript">
                    <Form.Label>Tar archive for building docker <Link to={"/help"}>image</Link></Form.Label>
                    <Form.Control type="file" placeholder="Choose tar archive for docker image build" name="dockerTar"
                                  ref={dockerTar}
                                  isInvalid={dockerTarValidationError !== null}/>
                    <Form.Control.Feedback type={"invalid"}>{dockerTarValidationError}</Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBuildScript">
                    <Form.Label>Build script</Form.Label>
                    <Form.Control type="file" placeholder="Choose build script" name="buildScript" ref={buildScript}
                                  isInvalid={buildScriptValidationError !== null}/>
                    <Form.Control.Feedback type={"invalid"}>{buildScriptValidationError}</Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formRunScript">
                    <Form.Label>Run script</Form.Label>
                    <Form.Control type="file" placeholder="Choose run script" name="runScript" ref={runScript}
                                  isInvalid={runScriptValidationError !== null}/>
                    <Form.Control.Feedback type={"invalid"}>{runScriptValidationError}</Form.Control.Feedback>
                </Form.Group>
                <Form.Group>
                    <Button type="submit" variant="dark">Create</Button>
                </Form.Group>
            </Form>
        </Container>
    );
}