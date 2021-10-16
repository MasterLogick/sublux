import React, {useEffect, useState} from "react";
import {Button, Col, Container, Nav, Pagination, Row, Table} from "react-bootstrap";
import axios from "axios";
import {Link, Route, Switch, useParams} from "react-router-dom";
import {TaskShortView} from "./Task";

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
            console.log(data);
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
    return null;
}