import React, {useEffect, useState} from "react";
import axios from "axios";
import {Badge, Container} from "react-bootstrap";
import {Link, Route, Switch, useParams} from "react-router-dom";
import {isLogged} from "./Authorization";

export {TaskShortView, getMyTasks};

export default function Task(props) {
    return (
        <Switch>
            <Route path={`${props.match.path}create`} exact>
                <div/>
            </Route>
            <Route path={`${props.match.path}:id`} component={TaskFullView}/>
        </Switch>
    );
}

function TaskFullView() {
    let {id} = useParams();
    const [task, setTask] = useState();
    useEffect(() => {
        axios.get(`/api/task/${id}`).then(resp => {
            setTask(resp.data);
        }).catch(console.log);
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

class TaskShortView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {takenPoints: 0, totalPoints: 0, error: null};
    }

    componentDidMount() {
        axios.get(`/api/task/${this.props.id}`).then((data) => {
            console.log(data.data);
            this.setState({takenPoints: data.data.takenPoints, totalPoints: data.data.totalPoints, error: null});
        }).catch((error) => {
            this.setState({error: error});
        });
    }

    getBadgeVariant() {
        if (this.state.error !== null) return "danger";
        const part = this.state.totalPoints / this.state.takenPoints;
        if (part >= 0.9) {
            return "success";
        } else if (part >= 0.5) {
            return "warning";
        } else {
            return "danger";
        }
    }

    getPointsLabel() {
        if (this.state.error === null)
            return `${this.state.takenPoints}/${this.state.totalPoints}`;
        else
            return "N/A";
    }

    render() {
        return (
            <tr>
                <td><Link to={`/task/${this.props.id}`}>{this.props.name}</Link></td>
                <td><Badge
                    variant={this.getBadgeVariant()}>{this.getPointsLabel()}</Badge>
                </td>
            </tr>
        );
    }
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