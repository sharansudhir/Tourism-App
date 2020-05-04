import React from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import Navigation from '../Navigation';
import BookingPage from '../Booking';
import SignUpPage from '../SignUp';
import SignInPage from '../SignIn';
import HomePage from '../Home';

import * as ROUTES from '../../constants/routes';
import {withFirebase} from '../Firebase';

import {withAuthentication} from '../Session';


const App = () => (
  <Router>
    <div>
      <Navigation />
      <hr />
      <Route  path={ROUTES.BOOKING} component={BookingPage} />
      <Route path={ROUTES.SIGN_UP} component={SignUpPage} />
      <Route path={ROUTES.SIGN_IN} component={SignInPage} />
      <Route exact path={ROUTES.HOME} component={HomePage} />
    </div>
  </Router>
);

export default withAuthentication(App);
