import React from "react";
import {Container, Nav, Navbar} from "react-bootstrap";
import {Link} from "react-router-dom";
import {UserHeaderDropdown} from "./User";

export default function Header() {
    return (
        <Navbar collapseOnSelect variant="dark" bg="dark" sticky="top">
            <Container fluid>
                <Link to="/" className="navbar-brand">SubLux</Link>
                <Navbar.Toggle aria-controls="responsive-navbar-nav"/>
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="me-auto">
                        <Link to="/contest" className={"nav-link"}>Contests</Link>
                        <Link to="/task" className={"nav-link"}>Tasks</Link>
                    </Nav>
                    <Nav>
                        <UserHeaderDropdown/>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

