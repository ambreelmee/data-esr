import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter, Route, Switch } from 'react-router-dom';

// Styles
// Import Flag Icons Set
import 'flag-icon-css/css/flag-icon.min.css';
// Import Font Awesome Icons Set
import 'font-awesome/css/font-awesome.min.css';
// Import Simple Line Icons Set
import 'simple-line-icons/css/simple-line-icons.css';
// Import Main styles for this application
import '../scss/style.scss';
// Temp fix for reactstrap
import '../scss/core/_dropdown-menu-right.scss';

import PrivateRoute from './PrivateRoute';
import Full from './containers/Full/';
import Login from './views/Pages/Login';
import Register from './views/Pages/Register';

ReactDOM.render(
  (
    <HashRouter>
      <Switch>
        <PrivateRoute path="/" name="Home" component={Full} />
        <Route exact path="/login" name="Login" component={Login} />
        <Route exact path="/register" name="Register" component={Register} />
      </Switch>
    </HashRouter>
  ), document.getElementById('root'),
);
