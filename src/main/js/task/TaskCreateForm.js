import React, {useState} from "react";
import {useHistory} from "react-router-dom";
import {getProgramDTO, ProgramUploadFormGroup} from "../Program";
import {getTestsDTO, TestsEditor} from "../Test";
import axios from "axios";
import {Button, Container, Form} from "react-bootstrap";
import {RequireAuthorized} from "../Authorization";
import LanguageSelector from "../language/LanguageSelector";

export default function TaskCreateForm() {
    let name = React.createRef();
    let description = React.createRef();
    const [nameValidationError, setNameValidationError] = useState(null);
    const [descriptionValidationError, setDescriptionValidationError] = useState(null);
    const [testClusters, setTestClusters] = useState([]);
    const [allowedLanguages, setAllowedLanguages] = useState([]);
    const [validatorSrcValidationError, setValidatorSrcValidationError] = useState(null);
    const [validatorSrc, setValidatorSrc] = useState(null);
    const [validatorLanguage, setValidatorLanguage] = useState(null);
    const [solutionSrcValidationError, setSolutionSrcValidationError] = useState(null);
    const [solutionSrc, setSolutionSrc] = useState(null);
    const [solutionLanguage, setSolutionLanguage] = useState(null);

    let history = useHistory();

    function onSubmit(event) {
        event.preventDefault();
        event.stopPropagation();
        setNameValidationError(null);
        setDescriptionValidationError(null);
        setValidatorSrcValidationError(null);
        setSolutionSrcValidationError(null);
        let valid = true;
        if (!name.current.value) {
            setNameValidationError("Name is empty");
            valid = false;
        }
        if (!description.current.value) {
            setDescriptionValidationError("Description is empty");
            valid = false;
        }
        if (validatorSrc.length === 0) {
            setValidatorSrcValidationError("Select language for validator");
            valid = false;
        }
        if (solutionSrc.length === 0) {
            setSolutionSrcValidationError("Select language for solution");
            valid = false;
        }
        if (!valid) return;
        getProgramDTO(validatorSrc, validatorLanguage).then(validatorDTO => {
            getProgramDTO(solutionSrc, solutionLanguage).then(solutionDTO => {
                getTestsDTO(testClusters).then(testsDTO => {
                    const data = {
                        name: name.current.value,
                        description: description.current.value,
                        allowedLanguages: allowedLanguages.map(lang => lang.id),
                        validator: validatorDTO,
                        solution: solutionDTO,
                        tests: testsDTO
                    }
                    console.log(JSON.stringify(data));
                    axios.post("/api/task/create", JSON.stringify(data), {
                        headers: {"Content-Type": "application/json"}
                    }).then(() => history.push("/")).catch(err => {
                        err.response.data;
                    });
                });
            });
        });
    }

    return (
        <Container>
            <RequireAuthorized/>
            <h3>Create new task</h3>
            <Form noValidate onSubmit={onSubmit}>
                <Form.Group className="mb-3" controlId="formName">
                    <Form.Label>Name</Form.Label>
                    <Form.Control type="text" placeholder="Enter name" name="name" ref={name}
                                  isInvalid={nameValidationError !== null}/>
                    <Form.Control.Feedback type="invalid">{nameValidationError}</Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formDescription">
                    <Form.Label>Description</Form.Label>
                    <Form.Control as="textarea" placeholder="Enter description" name="description" ref={description}
                                  isInvalid={descriptionValidationError !== null}/>
                    <Form.Control.Feedback type="invalid">{descriptionValidationError}</Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3" controlId="languages">
                    <Form.Label>Allowed languages</Form.Label>
                    <LanguageSelector multiple value={allowedLanguages} onSelect={setAllowedLanguages}/>
                </Form.Group>
                <ProgramUploadFormGroup className="mb-3" label="Validator" name="validator"
                                        isSrcInvalid={validatorSrcValidationError !== null}
                                        srcValidationError={validatorSrcValidationError}
                                        onSrcChange={setValidatorSrc} language={validatorLanguage}
                                        onLangChange={setValidatorLanguage}/>
                <ProgramUploadFormGroup className="mb-3" label="Solution" name="solution"
                                        isSrcInvalid={solutionSrcValidationError !== null}
                                        srcValidationError={solutionSrcValidationError}
                                        onSrcChange={setSolutionSrc} language={solutionLanguage}
                                        onLangChange={setSolutionLanguage}/>
                <TestsEditor label="Tests" className="mb-3" testClusters={testClusters} onChange={setTestClusters}/>
                <Form.Group>
                    <Button type="submit" variant="dark">Create</Button>
                </Form.Group>
            </Form>
        </Container>
    );
}
