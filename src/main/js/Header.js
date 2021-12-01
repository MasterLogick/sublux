import React from "react";
import {Container, Nav, Navbar, NavDropdown} from "react-bootstrap";
import {Link} from "react-router-dom";
import {isLogged, useUser} from "./Authorization";

export default function Header() {
    return (
        <Navbar collapseOnSelect variant="dark" bg="dark" sticky="top">
            <Container fluid>
                <Link to="/" className="navbar-brand">SubLux</Link>
                <Navbar.Toggle aria-controls="responsive-navbar-nav"/>
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="me-auto">
                        <Link to="/contest" className={"nav-link"}>Contests</Link>
                        <Link to="/language" className={"nav-link"}>Supported languages</Link>
                    </Nav>
                    <Nav>
                        <UserHeaderDropdown/>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

function UserHeaderDropdown() {
    let user = useUser();
    if (isLogged(user))
        return (
            <NavDropdown id={"header-nav-menu-dropdown"} title={user.username} align={"end"}>
                <NavDropdown.Item>
                    <Link to={"/user/profile"} className="nav-link bg-transparent text-dark">Profile</Link>
                </NavDropdown.Item>
                <NavDropdown.Divider/>
                <NavDropdown.Item>
                    <Link to={"/contest/create"} className="nav-link bg-transparent text-dark">Create contest</Link>
                </NavDropdown.Item>
                <NavDropdown.Item>
                    <Link to={"/task/create"} className="nav-link bg-transparent text-dark">Create task</Link>
                </NavDropdown.Item>
                <NavDropdown.Item>
                    <Link to={"/language/create"} className="nav-link bg-transparent text-dark">Create language</Link>
                </NavDropdown.Item>
                <NavDropdown.Divider/>
                <NavDropdown.Item>
                    <Link to={"/user/logout"} className="nav-link bg-transparent text-dark">Log out</Link>
                </NavDropdown.Item>
            </NavDropdown>
        );
    else
        return (
            <Link to={"/user/login"} className={"nav-link"}>Log in</Link>
        )
}
