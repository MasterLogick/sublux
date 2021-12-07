import {Link, useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import axios from "axios";
import {Container, Table} from "react-bootstrap";
import {MarkdownDescription} from "../MarkdownDescription";

export default function ContestInfo() {
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
            <p><MarkdownDescription>{data.description}</MarkdownDescription></p>
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