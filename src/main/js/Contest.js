import React, {useEffect, useState} from "react";
import {Button, Col, Container, Form, Row, Table} from "react-bootstrap";
import axios from "axios";
import {Link, Route, Switch, useHistory, useParams} from "react-router-dom";
import {RequireAuthorized, useUser} from "./Authorization";
import {getMyTasks} from "./Task";
import PagedList from "./PagedList";
import {EditableTable} from "./EditableTable";

export default function Contest(props) {
    return (
        <Switch>
            <Route path={`${props.match.path}`} exact component={ContestList}/>
            <Route path={`${props.match.path}create`} exact component={ContestCreateForm}/>
            <Route path={`${props.match.path}:id`} component={ContestInfo}/>
        </Switch>);
}

function ContestList() {
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
            <PagedList url={"/api/contest/all"}
                       header={<tr>
                           <th className={"col-9"}>Name</th>
                           <th className={"col-3"}>Author</th>
                       </tr>}
                       objectMapper={obj => (
                           <>
                               <td><Link to={`/contest/${obj.id}`}>{obj.name}</Link></td>
                               <td><Link to={`/user/${obj.author.id}`}>{obj.author.username}</Link></td>
                           </>
                       )}/>
        </Container>
    );
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
                        return data.tasks.map((task, index) =>
                            <tr key={index}>
                                <td><Link to={`/task/${task.id}`}>{task.name}</Link></td>
                                <td>0/0</td>
                            </tr>)
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
    const newElement = () => {
        return {ref: React.createRef(), task: null};
    };

    let name = React.createRef();
    let description = React.createRef();
    let addTask = React.createRef();
    let history = useHistory();
    let user = useUser();
    const [nameValidationError, setNameValidationError] = useState(null);
    const [descriptionValidationError, setDescriptionValidationError] = useState(null);
    const [tasksValidationError, setTasksValidationError] = useState(null);
    const [selectedTasks, setSelectedTasks] = useState([newElement()]);
    const [unusedTasks, setUnusedTasks] = useState([]);

    useEffect(() => {
        getMyTasks(user).then(setUnusedTasks);
    }, []);

    function onSubmit(event) {
        event.preventDefault();
        event.stopPropagation();
        setNameValidationError(null);
        setDescriptionValidationError(null);
        setTasksValidationError(null);
        if (selectedTasks.length === 0) {
            setTasksValidationError("Select at least one task");
        }
        axios.post("/api/contest/create", {
            name: name.current.value,
            description: description.current.value,
            taskIds: selectedTasks.map(task => task.task.id)
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
        <Container>
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
                    {(selectedTasks.length === 1 && selectedTasks[0].task == null && unusedTasks.length === 0) && (
                        <div>You do not own any tasks. <Link to={"/task/create"}>Create</Link> one first.</div>
                    )}
                    <EditableTable classname={"d-flex me-auto"} data={selectedTasks} onChange={setSelectedTasks}
                                   dataMapper={(task, index) => {
                                       return (
                                           <>
                                               <td>{`Task ${index + 1}`}</td>
                                               <td>
                                                   <Form.Select onChange={() => {
                                                       const t = unusedTasks[task.ref.current.selectedIndex - 1];
                                                       const newUnused = unusedTasks.filter((elem, i) => i !== task.ref.current.selectedIndex - 1);
                                                       setUnusedTasks(task.task ? newUnused.concat(task.task) : newUnused);
                                                       task.task = t;
                                                       setSelectedTasks(selectedTasks.map((elem, i) => i === index ? task : elem));
                                                   }} ref={task.ref}>
                                                       <option>{task.task?.name || "Select task"}</option>
                                                       {(() => unusedTasks.map((task, key) => (
                                                           <option key={key}>{task.name}</option>
                                                       )))()}
                                                   </Form.Select>
                                               </td>
                                           </>
                                       );
                                   }}
                                   newElement={newElement}
                                   columns={(
                                       <>
                                           <td className={"col-2"}/>
                                           <td/>
                                       </>
                                   )}/>
                </div>
                <Form.Group>
                    <Button type="submit" variant="dark">Create</Button>
                </Form.Group>
            </Form>
        </Container>
    );
}