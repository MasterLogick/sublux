import React from "react";
import {Container, Navbar} from "react-bootstrap";

export default function Footer() {
    return (
        <Navbar bg="dark" variant="dark" className="mt-auto">
            <Container fluid className="justify-content-end">
                <Navbar.Text>
                    Made by <a href="https://github.com/MasterLogick">MasterLogick</a>
                </Navbar.Text>
            </Container>
        </Navbar>
    );
}