import React from 'react';

import { Route, Redirect } from 'react-router-dom';
import fakeAuth from './authentication';

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props => (
      fakeAuth.isAuthenticated === true
        ? <Component {...props} />
        : <Redirect to="/register" />
  )}
  />
);

export default PrivateRoute;
