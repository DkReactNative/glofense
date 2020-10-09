import React from 'react';
import {Route, useRouteMatch, Switch} from 'react-router-dom';
import Home from '../containers/App/Home';
import Contest from '../containers/App/ContestAndQuiz';
import Profile from '../containers/App/Profile';
import QuizDetail from '../containers/App/QuizDetail';
import ContestDetail from '../containers/App/ContestDetail';
import StartQuizComponent from "../containers/App/ChangeLanguage"
export default function AuthStack() {
  let {path, url} = useRouteMatch();
  console.log('path,url,pathname=>', path, url, window.location.pathname);
  return (
    <Switch>
      <Route path={`${path}/`} component={Home} exact />
      <Route path={`${path}/home`} component={Home} exact />
      <Route path={`${path}/profile`} component={Profile} exact />
      <Route path={`${path}/contest-quiz/:id`} component={Contest} exact />
      <Route
        path={`${path}/contest-detail/:id`}
        component={ContestDetail}
        exact
      />
      <Route path={`${path}/quiz-detail/:id`} component={QuizDetail} exact />
      <Route path={`${path}/start-quiz/:id`} component={StartQuizComponent} exact />
    </Switch>
  );
}
