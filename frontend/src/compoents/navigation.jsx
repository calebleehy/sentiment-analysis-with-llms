import React from "react";
import { Nav, Navbar, Container } from "react-bootstrap";
import logo from '../asset/logo.svg';

const Navigation = () => {

    return (
        <div>
            <Navbar expand="lg" className="navbar-dark position-absolute top-0">
                <Container className="Container fs-5">
                    <Navbar.Brand href="/">
                        <img src={logo} alt="logo" width="60" height="48" class="d-inline-block align-text-top" />
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="navbar-dark nav-underline">
                            <Nav.Link href="/">home</Nav.Link>
                            <Nav.Item className="dropdown">
                                <Nav.Link classname="dropdown-toggle" href="/dashboard" role="button" data-bs-Toggle="dropdown" aria-expand="false">service</Nav.Link>
                                <ul className="dropdown-menu bg-dark">
                                    <li> <a className="dropdown-item text-light" href="/dashboard">dashboard</a></li>
                                    <li><a className="dropdown-item text-light" href="/voting">voting</a></li>
                                </ul>
                            </Nav.Item>
                            <Nav.Link href="/about">about</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </div>
    )
}

export default Navigation;