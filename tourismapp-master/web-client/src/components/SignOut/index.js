import React from 'react';

import {withFirebase} from '../Firebase';

const SignOutButton = ({ firebase}) => (
  <a type='button' onClick={firebase.signOut}>
    Logout
  </a>
);

export default withFirebase(SignOutButton)
