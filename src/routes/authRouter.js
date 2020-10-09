import React, {Component} from 'react';
import {BrowserRouter, useRouteMatch, Route, Switch} from 'react-router-dom';
import Home from '../containers/Auth/Home';
import About from '../containers/Auth/About-Us';
import Contact from '../containers/Auth/Contact-Us';
import TermsConditions from '../containers/Auth/TermsConditions';
import Privacy from '../containers/Auth/Privacy-policy';
import HowItWorks from '../containers/Auth/How-it-works';

export default function AuthStack() {
  let {path, url} = useRouteMatch();
  console.log('66=>', path, url, window.location.pathname);
  return (
    <Switch>
      <Route path={`/`} component={Home} exact />
      <Route path={`/about`} component={About} />
      <Route path={`/contact`} component={Contact} exact />
      <Route path={`/terms-conditions`} component={TermsConditions} exact />
      <Route path={`/privacy-policy`} component={Privacy} exact />
      <Route path={`/how-it-works`} component={HowItWorks} exact />
    </Switch>
  );
}
