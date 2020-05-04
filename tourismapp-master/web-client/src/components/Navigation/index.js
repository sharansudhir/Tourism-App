import React from 'react';
import {Link} from 'react-router-dom';
import {Navbar, Nav, Button, Form, FormControl, Container} from 'react-bootstrap';
import * as ROUTES from '../../constants/routes';
import 'bootstrap/dist/css/bootstrap.min.css';
import SignOutButton from '../SignOut';
import {AuthUserContext} from '../Session';

const Navigation = () => (
  <div>
  <AuthUserContext.Consumer>
  {authUser => authUser ? <NavigationAuth /> : <NavigationNonAuth />}
  </AuthUserContext.Consumer>
  </div>
)
const NavigationAuth = () => (

  <div>
    <Navbar bg="dark" variant="dark">
    <Container>
      <Navbar.Brand href={ROUTES.HOME}>Tourism</Navbar.Brand>
      <Nav className="mr-auto">
      <Nav.Link href={ROUTES.HOME}>Home</Nav.Link>
      <Nav.Link href={ROUTES.BOOKING}>Bookings</Nav.Link>
      </Nav>
      <Navbar.Toggle />
      <Navbar.Collapse className="justify-content-end">
      <Nav.Link>
      <SignOutButton />
      </Nav.Link>
      <Navbar.Text>
      Signed in as:  <a href="#login">
      <AuthUserContext.Consumer>
      {authUser => authUser.displayName}
      </AuthUserContext.Consumer>
      </a>
      </Navbar.Text>
      </Navbar.Collapse>
       </Container>
    </Navbar>
  </div>

);
const NavigationNonAuth = () => (

  <div>
  <Navbar bg="dark" variant="dark">
  <Container>
    <Navbar.Brand href={ROUTES.HOME}>Tourism</Navbar.Brand>
    </Container>
  </Navbar>
  </div>

);


export default Navigation;
