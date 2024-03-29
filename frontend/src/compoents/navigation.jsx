import React from "react";
import { Nav, Navbar, Container } from "react-bootstrap";
import logo from '../asset/logo.svg';

const Navigation = () => {

    return (
        <div>
            <Navbar expand="lg" className="navbar-dark position-absolute top-0">
                <Container className="Container fs-5">
                    <Navbar.Brand href="/">
                        <img src={logo} alt="logo" width="60" height="48" className="d-inline-block align-text-top" />
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="navbar-dark nav-underline">
                            <Nav.Link href="/">home</Nav.Link>
                            <Nav.Item className="dropdown">
                                <Nav.Link className="dropdown-toggle" href="/dashboard" role="button" data-bs-toggle="dropdown" aria-expanded="false">service</Nav.Link>
                                <ul className="dropdown-menu bg-light w-25">
                                    <li> <a className="dropdown-item text-dark" href="/dashboard">NPS</a></li>
                                    <li><a className="dropdown-item text-dark" href="/statistics">Sample Statistics</a></li>
                                    <li><a className="dropdown-item text-dark" href="/comparisons">Bank Comparisions</a></li>
                                    <li><a className="dropdown-item text-dark" href="/recommendation">Recommendations</a></li>
                                    <li><a className="dropdown-item text-dark" href="/detailed">Detailed</a></li>
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