import React from "react";
import {Button, Col, Container, Form, Nav, Pagination, Row, Table} from "react-bootstrap";
import axios from "axios";
import {Link, Route, Switch} from "react-router-dom";
import {TaskShortView} from "./Task";
import {isAuthorized, Unauthorized} from "./Authorization";

export default function Contest(props) {
    return (
        <Switch>
            <Route path={`${props.match.path}`} exact component={ContestList}/>
            <Route path={`${props.match.path}create`} component={ContestCreateForm}/>
            <Route path={`${props.match.path}:id`} component={ContestInfo}/>
        </Switch>);
}

class ContestList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {currentPage: 0, totalPages: 1, perPage: 20, data: []};
    }

    getData() {
        axios.get("/api/contest/all", {
            params: {
                page: this.state.currentPage,
                perPage: this.state.perPage
            }
        }).then((data) => {
            this.setState({data: data.data.content, totalPages: data.data.totalPages});
        });
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevState.currentPage !== this.state.currentPage || prevState.perPage !== this.state.perPage) {
            this.getData();
        }
    }

    componentDidMount() {
        this.getData();
    }

    render() {
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
                        <th>Name</th>
                        <th>Author</th>
                    </tr>
                    </thead>
                    <tbody>
                    {this.state.data.map((obj, index) => (
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
                        <Pagination.Item onClick={() => this.setState(
                            (state) => ({currentPage: state.currentPage - 1}))}
                                         activeLabel={""}
                                         disabled={this.state.currentPage === 0}>
                            {"<"}
                        </Pagination.Item>

                        {this.state.currentPage >= 3 ?
                            <>
                                {/*the first page*/}
                                <Pagination.Item onClick={() => this.setState({currentPage: 0})}
                                                 activeLabel={""}>
                                    {1}
                                </Pagination.Item>

                                {/*ellipsis*/}
                                <Pagination.Item activeLabel={""}>
                                    {"..."}
                                </Pagination.Item>
                            </> : <></>}

                        {/*page # currentPage - 2*/}
                        {this.state.currentPage >= 2 ?
                            <Pagination.Item
                                onClick={() => this.setState((state) => ({currentPage: state.currentPage - 2}))}
                                activeLabel={""}>
                                {this.state.currentPage + 1 - 2}
                            </Pagination.Item>
                            : <></>}

                        {/*page # currentPage - 1*/}
                        {this.state.currentPage >= 1 ?
                            <Pagination.Item
                                onClick={() => this.setState((state) => ({currentPage: state.currentPage - 1}))}
                                activeLabel={""}>
                                {this.state.currentPage + 1 - 1}
                            </Pagination.Item>
                            : <></>}

                        {/*page # currentPage*/}
                        <Pagination.Item active
                                         activeLabel={""}>
                            {this.state.currentPage + 1}
                        </Pagination.Item>

                        {/*page # currentPage + 1*/}
                        {this.state.totalPages >= this.state.currentPage + 1 + 1 ?
                            <Pagination.Item
                                onClick={() => this.setState((state) => ({currentPage: state.currentPage + 1}))}
                                activeLabel={""}>
                                {this.state.currentPage + 1 + 1}
                            </Pagination.Item>
                            : <></>}

                        {/*page # currentPage + 2*/}
                        {this.state.totalPages >= this.state.currentPage + 1 + 2 ?
                            <Pagination.Item
                                onClick={() => this.setState((state) => ({currentPage: state.currentPage + 2}))}
                                activeLabel={""}>
                                {this.state.currentPage + 1 + 2}
                            </Pagination.Item>
                            : <></>}

                        {this.state.totalPages >= this.state.currentPage + 1 + 3 ?
                            <>
                                {/*ellipsis*/}
                                <Pagination.Item
                                    activeLabel={""}>
                                    {"..."}
                                </Pagination.Item>
                                {/*the last page*/}
                                <Pagination.Item
                                    onClick={() => this.setState((state) => ({currentPage: state.totalPages - 1}))}
                                    activeLabel={""}>
                                    {this.state.totalPages}
                                </Pagination.Item>
                            </> : <></>}

                        {/*next page*/}
                        <Pagination.Item
                            onClick={() => this.setState((state) => ({currentPage: state.currentPage + 1}))}
                            activeLabel={""}
                            disabled={this.state.currentPage + 1 === this.state.totalPages}>
                            {">"}
                        </Pagination.Item>
                    </Pagination>
                </Nav>
            </Container>
        );
    }
}

class ContestInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {data: null, error: ""};
    }

    componentDidMount() {
        axios.get(`/api/contest/${this.props.match.params.id}`).then((data) => {
            console.log(data);
            this.setState({data: data.data, error: null});
        }).catch((error) => {
            this.setState({error: error, data: null});
        });
    }

    render() {
        return (
            <Container>
                {(this.state.error !== null) ? this.notFound() : this.contestView()}
            </Container>
        );
    }

    notFound() {
        return (
            <>
                <h3>Contest {this.props.match.params.id} not found</h3>
                <Link to="/contest/">Return back</Link>
            </>
        );
    }

    contestView() {
        return (<>
            <h2>{this.state.data.name}</h2>
            <p>{this.state.data.description}</p>
            <Table responsive bordered hover>
                <thead>
                <tr>
                    <td>Task:</td>
                    <td>Points:</td>
                </tr>
                </thead>
                <tbody>{(() => {
                    if (this.state.data.tasks !== undefined) {
                        this.state.data.tasks.map((task, index) =>
                            <TaskShortView key={index} name={task.name} id={task.id}/>)
                    } else
                        return (<></>);
                })()}
                </tbody>
            </Table>
        </>);
    }
}

class ContestCreateForm extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        if (!isAuthorized())
            return (<Unauthorized return={this.props.match.path}/>);
        else
            return (
                <Container>
                    <Form>

                    </Form>
                </Container>
            );
    }
}