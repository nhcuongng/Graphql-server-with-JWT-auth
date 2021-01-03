import React from 'react';
import { BrowserRouter, Link, Route, Switch } from 'react-router-dom';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Register } from './pages/Register';

export function Routes() {
  return (
    <BrowserRouter>
      <div><Link to="/">home</Link></div>
      <div><Link to="/register">resgister</Link></div>
      <div><Link to="/login">login</Link></div>
      <div>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/register" component={Register} />
          <Route exact path="/login" component={Login} />
        </Switch>
      </div>
    </BrowserRouter>
  );
}
