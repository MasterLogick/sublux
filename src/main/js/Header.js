import React from "react";
import {LinkContainer} from "react-router-bootstrap";
import {Container, Nav, Navbar, NavbarBrand, NavLink} from "react-bootstrap";

export default function Header() {
    return (
        <Navbar collapseOnSelect variant="dark" bg="dark" sticky="top">
            <Container fluid>
                <LinkContainer to="/">
                    <NavbarBrand>SubLux</NavbarBrand>
                </LinkContainer>
                <Navbar.Toggle/>
                <Navbar.Collapse>
                    <Nav className="me-auto">
                        <LinkContainer to="/contest"><NavLink>Contests</NavLink></LinkContainer>
                        <LinkContainer to="/task"><NavLink>Tasks</NavLink></LinkContainer>
                    </Nav>
                    <Nav>
                        <LinkContainer to="/user"><NavLink>Profile</NavLink></LinkContainer>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}
