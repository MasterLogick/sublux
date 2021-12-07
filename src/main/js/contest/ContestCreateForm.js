import React, {useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {RequireAuthorized, useUser} from "../Authorization";
import getMyTasks from "../task/GetMyTasks";
import axios from "axios";
import {Alert, Button, Container, Form} from "react-bootstrap";
import {EditableTable} from "../EditableTable";

export default function ContestCreateForm() {
    const newElement = () => {
        return {ref: React.createRef(), task: null};
    };

    let name = React.createRef();
    let description = React.createRef();
    let navigate = useNavigate();
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
        if (selectedTasks.filter(task => task.task == null).length !== 0) {
            setTasksValidationError("Select all tasks");
        }
        axios.post("/api/contest/create", {
            name: name.current.value,
            description: description.current.value,
            taskIds: selectedTasks.map(task => task.task.id)
        }).then(() => navigate("/")).catch(err => {
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
                    <Form.Control as="textarea" placeholder="Enter description(markdown supported)" name="description"
                                  ref={description}
                                  isInvalid={descriptionValidationError !== null}/>
                    <Form.Control.Feedback type={"invalid"}>{descriptionValidationError}</Form.Control.Feedback>
                </Form.Group>
                <div className={"mb-3"}>
                    {tasksValidationError !== null && <Alert variant="danger">{tasksValidationError}</Alert>}
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