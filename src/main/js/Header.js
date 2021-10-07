import React from "react";
import {Container, Nav, Navbar} from "react-bootstrap";
import {Link} from "react-router-dom";

export default function Header() {
    return (
        <Navbar collapseOnSelect variant="dark" bg="dark" sticky="top">
            <Container fluid>
                <Link to="/" className={"navbar-brand"}>SubLux</Link>
                <Navbar.Toggle/>
                <Navbar.Collapse>
                    <Nav className="me-auto">
                        <Link to="/contest" className={"nav-link"}>Contests</Link>
                        <Link to="/task" className={"nav-link"}>Tasks</Link>
                    </Nav>
                    <Nav>
                        <Link to="/user/profile" className={"nav-link"}>Profile</Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}
