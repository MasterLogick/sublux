import React, {useEffect, useState} from "react";
import axios from "axios";
import {Badge, Button, Container, Form, OverlayTrigger, Popover, Tab, Table, Tabs} from "react-bootstrap";
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

function TaskFullView() {
    let {id} = useParams();
    let history = useHistory();
    const [task, setTask] = useState({});
    const [srcValidationError, setSrcValidationError] = useState(null);
    const [language, setLanguage] = useState(null);
    const [src, setSrc] = useState(null);
    const [mySolutions, setMySolutions] = useState(null);

    useEffect(() => {
        axios.get(`/api/task/${id}`).then(resp => {
            setTask(resp.data);
        });
    }, []);
    useEffect(() => {
        axios.get(`/api/solution/getMySolutions/${id}`).then(resp => {
            setMySolutions(resp.data);
        });
    }, []);

    function upload() {
        getProgramDTO(src, language).then(program => {
            const data = {
                taskId: id,
                solution: program
            };
            axios.post("/api/solution/upload", data).then(() => history.go(0)).catch(console.log);
        })
    }

    return (
        <Container>
            <h2>{task.name}</h2>
            <div className={"text-muted"}>
                Author: <Link to={`/user/${task.author?.id}`}
                              className={"text-secondary"}>{task.author?.username}</Link>
            </div>
            <hr/>
            <div className={"mb-1"}>
                Average time
                limit: <Badge
                bg={"secondary"}>{task.tasks?.map(cluster => cluster.timeLimit).reduce((a, b) => a + b, 0) / task.tasks?.length} ms</Badge>
            </div>
            <div>
                Average memory
                limit: <Badge
                bg={"secondary"}>{task.tasks?.map(cluster => cluster.memoryLimit).reduce((a, b) => a + b, 0) / task.tasks?.length} MB</Badge>
            </div>
            <p/>
            <p>{task.description}</p>
            <hr/>
            <h5>Tests</h5>
            <Tabs>
                {task.tasks?.map((c, key) => (<Tab key={key} title={c.name} eventKey={key}>
                    <div className={"my-1"}>
                        Time
                        limit: <Badge
                        bg={"secondary"}>{c.timeLimit} ms</Badge>
                    </div>
                    <div className={"my-1 mb-2"}>
                        Memory
                        limit: <Badge
                        bg={"secondary"}>{c.memoryLimit} MB</Badge>
                    </div>
                    <div className={"d-flex justify-content-start overflow-scroll"}>
                        {c.tests.map((t, i) => (
                            <h5 className={"mx-1"}><Badge key={i} bg={"warning"}>{t.points}p</Badge></h5>
                        ))}
                    </div>
                </Tab>))}
            </Tabs>
            <hr/>
            <ProgramUploadFormGroup className="mb-3" name="upload"
                                    isSrcInvalid={srcValidationError != null}
                                    onSrcChange={setSrc} language={language} onLangChange={setLanguage}/>
            <div className="d-flex justify-content-end">
                <Button className="ms-auto" variant={"dark"} onClick={upload}>Upload</Button>
            </div>
            <hr/>
            <Table bordered hover striped>
                <thead>
                <tr>
                    <td className="col-1">
                        ID
                    </td>
                    <td className="col-2">
                        Build
                    </td>
                    <td>Run</td>
                </tr>
                </thead>
                <tbody>
                {mySolutions?.map((sol, key) => (
                    <tr key={key}>
                        <td>{key + 1}</td>
                        <td>{getBuildReportBadge(sol.buildReport)}</td>
                        <td>{sol.buildReport.state === "SUCCESS" && getRunReportBadges(sol.runReports, task)}</td>
                    </tr>
                ))}
                </tbody>
            </Table>
        </Container>
    );
}

function getBuildReportBadge(buildReport) {
    let color = "";
    switch (buildReport.state) {
        case "SUCCESS":
            color = "success";
            break;
        case "TIME_LIMIT_EXCEEDED":
        case "MEMORY_LIMIT_EXCEEDED":
        case "VOLUME_QUOTA_EXCEEDED":
        case "RUNTIME_EXCEPTION":
        case "WRONG_ANSWER":
            color = "danger";
            break;
        case "DOCKER_EXCEPTION":
            color = "dark";
            break;
    }
    return (<Badge bg={color}>{buildReport.state}</Badge>)
}

function getRunReportBadges(runReports, task) {
    const badges = [];
    for (const testCluster of task?.tasks) {
        let totalSum = 0;
        let maxSum = 0;
        const testSet = [];
        for (const test of testCluster?.tests) {
            maxSum += test.points;
            const report = getReport(runReports, test.id);
            if (report.state === "SUCCESS") {
                totalSum += test.points;
            }
            testSet.push(getRunReportBadge(report, test));
        }
        let bg = "";
        if (totalSum >= maxSum) {
            bg = "success";
        } else if (totalSum * 2 >= maxSum) {
            bg = "warning";
        } else {
            bg = "danger";
        }
        badges.push((
            <OverlayTrigger placement="bottom" overlay={<Popover>
                <Popover.Body>
                    {testSet}
                </Popover.Body>
            </Popover>}>
                <Badge bg={bg}>{`${totalSum}/${maxSum}`}</Badge>
            </OverlayTrigger>));
    }
    return badges;
}


function getReport(runReports, id) {
    return runReports.filter(rep => rep.testId === id)[0].report;
}

function getRunReportBadge(runReport, test) {
    let color = "";
    switch (runReport.state) {
        case "SUCCESS":
            color = "success";
            break;
        case "TIME_LIMIT_EXCEEDED":
        case "MEMORY_LIMIT_EXCEEDED":
        case "VOLUME_QUOTA_EXCEEDED":
        case "RUNTIME_EXCEPTION":
        case "WRONG_ANSWER":
            color = "danger";
            break;
        case "DOCKER_EXCEPTION":
            color = "dark";
            break;
    }
    return (<Badge bg={color}>{`${runReport.state} (${runReport.state === "SUCCESS" ? test.points : 0}p)`}</Badge>)
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