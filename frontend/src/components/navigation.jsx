import React from "react";
import { Nav, Navbar, Container } from "react-bootstrap";
import logo from '../asset/logo.svg';

const Navigation = () => {

    return (
        <div>
            <Navbar expand="lg" className="navbar-dark position-absolute top-0">
                <Container className="Container fs-5">
                    <Navbar.Brand href="/">
                        <img src={logo} alt="logo" width="60" height="55" style={{marginLeft:'-4vw',marginTop:'-1vh'}} className="d-inline-block align-text-top" />
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="navbar-dark nav-underline">
                            <Nav.Link href="/">Home</Nav.Link>
                            <Nav.Item className="dropdown">
                                <Nav.Link className="dropdown-toggle" href="/dashboard" role="button" data-bs-toggle="dropdown" aria-expanded="false">Service</Nav.Link>
                                <ul className="dropdown-menu bg-light w-25">
                                    <li> <a className="dropdown-item text-dark" href="/dashboard">GXS</a></li>
                                    <li><a className="dropdown-item text-dark" href="/comparisons">Bank Comparisons</a></li>
                                    <li><a className="dropdown-item text-dark" href="/summary">Summary</a></li>
                                </ul>
                            </Nav.Item>
                            <Nav.Link href="/about">About</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </div>
    )
}

export default Navigation;