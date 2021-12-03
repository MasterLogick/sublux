import {Button, Col, Container, Row} from "react-bootstrap";
import {Link} from "react-router-dom";
import PagedList from "../PagedList";
import React from "react";

export default function ContestList() {
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