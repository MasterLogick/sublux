import React, {useEffect, useState} from "react";
import {Button, Col, Container, Form, Nav, Pagination, Row, Table} from "react-bootstrap";
import axios from "axios";
import {Link, Route, Switch, useHistory, useParams} from "react-router-dom";
import {TaskShortView} from "./Task";
import {RequireAuthorized} from "./Authorization";

export default function Contest(props) {
    return (
        <Switch>
            <Route path={`${props.match.path}`} exact component={ContestList}/>
            <Route path={`${props.match.path}create`} component={ContestCreateForm}/>
            <Route path={`${props.match.path}:id`} component={ContestInfo}/>
        </Switch>);
}

function ContestList() {
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [data, setData] = useState([]);
    const perPage = 20;

    function fetch() {
        axios.get("/api/contest/all", {
            params: {
                page: currentPage,
                perPage: perPage
            }
        }).then((data) => {
            setData(data.data.content);
            setTotalPages(data.data.totalPages);
        }).catch((err) => {
            console.log(err);
        });
    }

    useEffect(fetch, [currentPage]);

    return (
        <Container>
            <Row>
                <Col>
                    <h2>Contest list</h2>
                </Col>
                <Col className="d-flex justify-content-end">
                    <Link to={"/contest/create"}>
                        <Button variant="outline-dark">Create contest</Button>
                    </Link>
                </Col>
            </Row>
            <Table responsive bordered hover>
                <thead>
                <tr>
                    <th className={"col-9"}>Name</th>
                    <th className={"col-3"}>Author</th>
                </tr>
                </thead>
                <tbody>
                {data.map((obj, index) => (
                    <tr key={index}>
                        <td><Link to={`/contest/${obj.id}`}>{obj.name}</Link></td>
                        <td><Link to={`/user/${obj.author.id}`}>{obj.author.username}</Link></td>
                    </tr>
                ))}
                </tbody>
            </Table>
            <Nav className="justify-content-end">
                <Pagination size={"sm"}>
                    {/*previous page*/}
                    <Pagination.Item onClick={() => setCurrentPage(currentPage - 1)}
                                     activeLabel={""}
                                     disabled={currentPage === 0}>
                        {"<"}
                    </Pagination.Item>

                    {currentPage >= 3 ?
                        <>
                            {/*the first page*/}
                            <Pagination.Item onClick={() => setCurrentPage(0)}
                                             activeLabel={""}>
                                {1}
                            </Pagination.Item>

                            {/*ellipsis*/}
                            <Pagination.Item activeLabel={""}>
                                {"..."}
                            </Pagination.Item>
                        </> : <></>}

                    {/*page # currentPage - 2*/}
                    {currentPage >= 2 ?
                        <Pagination.Item
                            onClick={() => setCurrentPage(currentPage - 2)}
                            activeLabel={""}>
                            {currentPage + 1 - 2}
                        </Pagination.Item>
                        : <></>}

                    {/*page # currentPage - 1*/}
                    {currentPage >= 1 ?
                        <Pagination.Item
                            onClick={() => setCurrentPage(currentPage - 1)}
                            activeLabel={""}>
                            {currentPage + 1 - 1}
                        </Pagination.Item>
                        : <></>}

                    {/*page # currentPage*/}
                    <Pagination.Item active
                                     activeLabel={""}>
                        {currentPage + 1}
                    </Pagination.Item>

                    {/*page # currentPage + 1*/}
                    {totalPages >= currentPage + 1 + 1 ?
                        <Pagination.Item
                            onClick={() => setCurrentPage(currentPage + 1)}
                            activeLabel={""}>
                            {currentPage + 1 + 1}
                        </Pagination.Item>
                        : <></>}

                    {/*page # currentPage + 2*/}
                    {totalPages >= currentPage + 1 + 2 ?
                        <Pagination.Item
                            onClick={() => setCurrentPage(currentPage + 2)}
                            activeLabel={""}>
                            {currentPage + 1 + 2}
                        </Pagination.Item>
                        : <></>}

                    {totalPages >= currentPage + 1 + 3 ?
                        <>
                            {/*ellipsis*/}
                            <Pagination.Item
                                activeLabel={""}>
                                {"..."}
                            </Pagination.Item>
                            {/*the last page*/}
                            <Pagination.Item
                                onClick={() => setCurrentPage(totalPages - 1)}
                                activeLabel={""}>
                                {totalPages}
                            </Pagination.Item>
                        </> : <></>}

                    {/*next page*/}
                    <Pagination.Item
                        onClick={() => setCurrentPage(currentPage + 1)}
                        activeLabel={""}
                        disabled={currentPage + 1 === totalPages}>
                        {">"}
                    </Pagination.Item>
                </Pagination>
            </Nav>
        </Container>
    )
        ;
}

function ContestInfo() {
    let {id} = useParams();
    const [data, setData] = useState({});
    const [error, setError] = useState(null);
    useEffect(() => {
        axios.get(`/api/contest/${id}`).then((data) => {
            setData(data.data);
            setError(null);
        }).catch((error) => {
            setData(null);
            setError(error);
        });
    }, []);

    function notFound() {
        return (
            <>
                <h3>Contest {id} not found</h3>
                <Link to="/contest/">Return back</Link>
            </>
        );
    }

    function contestView() {
        return (<>
            <h2>{data.name}</h2>
            <p>{data.description}</p>
            <Table responsive bordered hover>
                <thead>
                <tr>
                    <td className={"col-10"}>Task:</td>
                    <td>Points:</td>
                </tr>
                </thead>
                <tbody>{(() => {
                    if (data.tasks !== undefined) {
                        data.tasks.map((task, index) =>
                            <TaskShortView key={index} name={task.name} id={task.id}/>)
                    } else
                        return (<></>);
                })()}
                </tbody>
            </Table>
        </>);
    }

    return (
        <Container>
            {(error !== null) ? notFound() : contestView()}
        </Container>
    );
}

function ContestCreateForm() {
    let name = React.createRef();
    let description = React.createRef();
    let addTask = React.createRef();
    let history = useHistory();
    const [nameValidationError, setNameValidationError] = useState(null);
    const [descriptionValidationError, setDescriptionValidationError] = useState(null);
    const [tasksValidationError, setTasksValidationError] = useState(null);
    const [selectedTasks, setSelectedTasks] = useState([]);
    const [unusedTasks, setUnusedTasks] = useState([]);
    useEffect(() => {
        function fetch(currentPage, perPage, total) {
            axios.get("/api/task/getMy", {
                params: {
                    page: currentPage,
                    perPage: perPage
                }
            }).then(resp => {
                setUnusedTasks(unusedTasks.concat(resp.data.content));
                total = resp.data.totalElements;
                if (total > (currentPage + 1) * perPage) fetch(currentPage + 1, perPage, total);
            }).catch(err => alert(err));
        }

        fetch(0, 20, 1);
    }, []);

    function onSubmit(event) {
        event.preventDefault();
        event.stopPropagation();
        setNameValidationError(null);
        setDescriptionValidationError(null);
        setTasksValidationError(null);
        /*if (selectedTasks.length === 0) {
            setTasksValidationError("Select at least one task");
        }*/
        axios.post("/api/contest/create", {
            name: name.current.value,
            description: description.current.value,
            taskIds: selectedTasks.map(task => task.id)
        }).then(() => history.push("/")).catch(err => {
            for (const error of err.response.data.errorList) {
                switch (error.objectName) {
                    case "name":
                        setNameValidationError(error.message);
                        break;
                    case "description":
                        setDescriptionValidationError(error.message);
                        break;
                    case "taskIds":
                        setTasksValidationError(error.message);
                        break;
                }
            }
        });
    }

    return (
        <Container className={"mb-3"}>
            <RequireAuthorized/>
            <h3>Create new contest</h3>
            <Form noValidate onSubmit={onSubmit}>
                <Form.Group className="mb-3" controlId="formName">
                    <Form.Label>Name</Form.Label>
                    <Form.Control type="text" placeholder="Enter name" name="name" ref={name}
                                  isInvalid={nameValidationError !== null}/>
                    <Form.Control.Feedback type={"invalid"}>{nameValidationError}</Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formDescription">
                    <Form.Label>Description</Form.Label>
                    <Form.Control as="textarea" placeholder="Enter description" name="description" ref={description}
                                  isInvalid={descriptionValidationError !== null}/>
                    <Form.Control.Feedback type={"invalid"}>{descriptionValidationError}</Form.Control.Feedback>
                </Form.Group>
                <div className={"mb-3"}>
                    <Form.Label>Task list</Form.Label>
                    <hr className={"mb-2 mt-0"}/>
                    <Table borderless responsive className={"d-flex me-auto"}>
                        <tbody>
                        {(() => selectedTasks.map((task, index) => (
                            <tr key={index} className={"d-flex align-items-center"}>
                                <td>{`Task ${index + 1}`}</td>
                                <td>{task.name}</td>
                                <td>
                                    <Button variant={"outline-dark"} onClick={() => {
                                        const task = selectedTasks[index];
                                        setSelectedTasks(selectedTasks.filter((elem, i) => i !== index));
                                        setUnusedTasks(unusedTasks.concat(task));
                                    }}>-</Button>
                                </td>
                            </tr>
                        )))()}
                        {(() => {
                            if (unusedTasks.length > 0)
                                return (
                                    <tr className={"d-flex align-items-center"}>
                                        <td>{`Task ${selectedTasks.length + 1}`}</td>
                                        <td colSpan={2}>
                                            <Form.Group controlId="formTask">
                                                <Form.Select placeholder={"Add task"} onChange={() => {
                                                    const task = unusedTasks[addTask.current.selectedIndex - 1];
                                                    setUnusedTasks(unusedTasks.filter((elem, index) => index !== addTask.current.selectedIndex - 1));
                                                    setSelectedTasks(selectedTasks.concat(task));
                                                    addTask.current.selectedIndex = 0;
                                                }} ref={addTask} isInvalid={tasksValidationError !== null}>
                                                    <option>Select task</option>
                                                    {(() => unusedTasks.map((task, key) => (
                                                        <option key={key}>{task.name}</option>
                                                    )))()}
                                                </Form.Select>
                                                <Form.Control.Feedback
                                                    type={"invalid"}>{tasksValidationError}</Form.Control.Feedback>
                                            </Form.Group>
                                        </td>
                                    </tr>
                                );
                        })()}
                        {(() => {
                            if (unusedTasks.length + selectedTasks.length === 0) return (
                                <tr>
                                    <td>
                                        You do not own any tasks. <Link to={"/task/create"}>Create</Link> one first.
                                    </td>
                                </tr>
                            );
                        })()}
                        </tbody>
                    </Table>
                </div>
                <Form.Group>
                    <Button type="submit" variant="dark">Create</Button>
                </Form.Group>
            </Form>
        </Container>
    );
}