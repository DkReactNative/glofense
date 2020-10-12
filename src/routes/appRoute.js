import React from 'react';
import {Route, useRouteMatch, Switch} from 'react-router-dom';
import Home from '../containers/App/Home';
import Contest from '../containers/App/ContestAndQuiz';
import Profile from '../containers/App/Profile';
import QuizDetail from '../containers/App/QuizDetail';
import ContestDetail from '../containers/App/ContestDetail';
import StartQuizComponent from "../containers/App/ChangeLanguage";
import EditProfile from "../containers/App/EditProfile";
import News from "../containers/App/News";
import NewsDetail from "../containers/App/NewsDetail"
export default function AuthStack() {
  let {path, url} = useRouteMatch();
  console.log('path,url,pathname=>', path, url, window.location.pathname);
  return (
    <Switch>
      <Route path={`${path}/`} component={Home} exact />
      <Route path={`${path}/home`} component={Home} exact />
      <Route path={`${path}/profile`} component={Profile} exact />
      <Route path={`${path}/edit-profile`} component={EditProfile} exact />
      <Route path={`${path}/contest-quiz/:id`} component={Contest} exact />
      <Route
        path={`${path}/contest-detail/:id`}
        component={ContestDetail}
        exact
      />
      <Route path={`${path}/quiz-detail/:id`} component={QuizDetail} exact />
      <Route path={`${path}/start-quiz/:id`} component={StartQuizComponent} exact />
      <Route path={`${path}/news`} component={News} exact />
      <Route path={`${path}/news-detail/:id`} component={NewsDetail} exact />
    </Switch>
  );
}
