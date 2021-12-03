import {Button, Col, Container, Row} from "react-bootstrap";
import {Link} from "react-router-dom";
import PagedList from "../PagedList";
import React from "react";

export default function LanguageList() {
    return (
        <Container>
            <Row>
                <Col>
                    <h2>Language list</h2>
                </Col>
                <Col className="d-flex justify-content-end">
                    <Link to={"/language/create"}>
                        <Button variant="outline-dark">Create language</Button>
                    </Link>
                </Col>
            </Row>
            <PagedList url={"/api/language/all"}
                       header={<tr>
                           <th className={"col-9"}>Name</th>
                       </tr>}
                       objectMapper={obj => (
                           <>
                               <td><Link to={`/language/${obj.id}`}>{obj.name}</Link></td>
                           </>
                       )}/>
        </Container>
    );
}