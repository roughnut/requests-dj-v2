import React from "react";
import { Link } from "react-router-dom";
import Auth from "../utils/auth";
import { useSongContext } from "../utils/GlobalState";
import { Navbar as BootstrapNavbar, Nav, Container } from "react-bootstrap";

export default function Navbar() {
  const { state } = useSongContext();

  const handleLogout = () => {
    Auth.logout();
  };

  return (
    <BootstrapNavbar bg="light" expand="lg" className="mb-4">
      <Container>
        <BootstrapNavbar.Brand as={Link} to="/">Requests.DJ</BootstrapNavbar.Brand>
        <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
        <BootstrapNavbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/">Home</Nav.Link>
            <Nav.Link as={Link} to="/events">Events</Nav.Link>
            {state.isAuthenticated ? (
              <>
              <Nav.Link as={Link} to="/dashboard">Dashboard</Nav.Link>
              <Nav.Link as={Link} to="/" onClick={handleLogout}>Logout</Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login">Login</Nav.Link>
                <Nav.Link as={Link} to="/signup">Signup</Nav.Link>
              </>
            )}
          </Nav>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
}