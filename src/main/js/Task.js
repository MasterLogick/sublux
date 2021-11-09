import React, {useEffect, useState} from "react";
import axios from "axios";
import {Button, Container, Form} from "react-bootstrap";
import {Link, Route, Switch, useHistory, useParams} from "react-router-dom";
import {isLogged, RequireAuthorized} from "./Authorization";
import {getProgramDTO, ProgramUploadFormGroup} from "./Program";
import {LanguageSelector} from "./Language";
import {getTestsDTO, TestsEditor} from "./Test";

export {getMyTasks};

export default function Task(props) {
    return (
        <Switch>
            <Route path={`${props.match.path}create`} exact component={TaskCreateForm}/>
            <Route path={`${props.match.path}:id`} component={TaskFullView}/>
        </Switch>
    );
}

function TaskCreateForm() {
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
                    axios.post("/api/task/create", data).then(() => history.push("/")).catch(err => {
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

function TaskFullView() {
    let {id} = useParams();
    const [task, setTask] = useState();
    useEffect(() => {
        axios.get(`/api/task/${id}`).then(resp => {
            setTask(resp.data);
        });
    }, []);
    if (task === undefined)
        return null;
    else
        return (
            <Container>
                <h2>{task.name}</h2>
                <div className={"text-muted"}>
                    Author: <Link to={`/user/${task.author.id}`}
                                  className={"text-secondary"}>{task.author.username}</Link>
                </div>
                <hr/>
                <p>{task.description}</p>
                <hr/>
                ---Submit zone---
            </Container>
        );
}

function getMyTasks(user) {
    if (isLogged(user)) {
        return new Promise((resolve, reject) => {
                let unusedTasks = [];

                function fetch(currentPage, perPage, total) {
                    axios.get("/api/task/getMy", {
                        params: {
                            page: currentPage,
                            perPage: perPage
                        }
                    }).then(resp => {
                            unusedTasks = unusedTasks.concat(resp.data.content);
                            total = resp.data.totalElements;
                            if (total > (currentPage + 1) * perPage) {
                                fetch(currentPage + 1, perPage, total);
                            } else {
                                resolve(unusedTasks);
                            }
                        }
                    ).catch(reject);
                }

                fetch(0, 20, 1);
            }
        );
    } else {
        return Promise.reject("Unauthorized access");
    }
}