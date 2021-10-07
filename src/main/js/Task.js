import React from "react";
import axios from "axios";
import {Badge, Container} from "react-bootstrap";
import {Link, Route, Switch} from "react-router-dom";

export {TaskShortView};
export default function Task(props) {
    return (
        <Switch>
            <Route to={`${props.match.path}create`}></Route>
            <Route to={`${props.match.path}:id`}></Route>
        </Switch>
    );
}

class TaskFullView extends React.Component {
    render() {
        return (<Container></Container>);
    }
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