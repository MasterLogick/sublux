import React from "react";
import {Container, Nav, Pagination, Table} from "react-bootstrap";
import axios from "axios";
import {Link, Route, Switch} from "react-router-dom";

export default class Contest extends React.Component {
    render() {
        return (
            <Switch>
                <Route path={`${this.props.match.path}/`} exact component={ContestList}/>
                <Route path={`${this.props.match.path}/:id`} component={ContestInfo}/>
            </Switch>);
    }
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
            <Container fluid>
                Contest list
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
    render() {
        return (
            <Container fluid>
                <div>{this.props.match.params.id}</div>
            </Container>
        )
    }
}