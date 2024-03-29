import React from 'react';
import {Route, useRouteMatch, Switch} from 'react-router-dom';
import Home from '../containers/App/Home';
import Contest from '../containers/App/ContestAndQuiz';
import Profile from '../containers/App/Profile';
import QuizDetail from '../containers/App/QuizDetail';
import ContestDetail from '../containers/App/ContestDetail';
import PlayQuiz from '../containers/App/PlayQuiz';
import PlayContest from '../containers/App/PlayContest';
import EditProfile from '../containers/App/EditProfile';
import News from '../containers/App/News';
import Notification from "../containers/App/Notifications"
import NewsDetail from '../containers/App/NewsDetail';
import MatchComplete from '../containers/App/MatchComplete';
import MoreOption from '../containers/App/More';
import CmsPage from '../containers/App/More/cms';
import ReferralCode from '../containers/App/More/referral-code';
import ChooseLangugae from '../containers/App/ChangeLanguage';
import InvideCode from '../containers/App/InviteCode';
import QuizInviteCode from '../containers/App/More/QuizInvite';
import MyAccount from '../containers/App/Profile/my-account';
import Transaction from "../containers/App/Profile/transaction"
import Withdraw from "../containers/App/Profile/withdraw";
import MyContest from "../containers/App/MyContest";
import MyContestDetail from "../containers/App/MyContest/contestDetail";
import ContestEnd from "../containers/App/MyContest/contestComplete";
import AddMoney from "../containers/App/Profile/addMoney"
import paymentComplete from '../containers/App/Profile/payment-complete';
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
      <Route
        path={`${path}/choose-language/:id`}
        component={ChooseLangugae}
        exact
      />
      <Route path={`${path}/quiz-detail/:id`} component={QuizDetail} exact />
      <Route path={`${path}/play-quiz/:id`} component={PlayQuiz} exact />
      <Route path={`${path}/invite-code/:id`} component={InvideCode} exact />
      <Route path={`${path}/play-contest/:id`} component={PlayContest} exact />
      <Route path={`${path}/news`} component={News} exact />
      <Route path={`${path}/notification`} component={Notification} exact />
      <Route path={`${path}/news-detail/:id`} component={NewsDetail} exact />
      <Route path={`${path}/match-end/:id`} component={MatchComplete} exact />
      <Route path={`${path}/contest-end/:id`} component={ContestEnd} exact />
      <Route path={`${path}/more`} component={MoreOption} exact />
      <Route path={`${path}/more/:id`} component={CmsPage} exact />
      <Route path={`${path}/invite-quiz`} component={QuizInviteCode} exact />
      <Route path={`${path}/referral-code`} component={ReferralCode} exact />
      <Route path={`${path}/my-account`} component={MyAccount} exact />
      <Route path={`${path}/my-contest`} component={MyContest} exact />
      <Route
        path={`${path}/my-contest/contest-detail/:id`}
        component={MyContestDetail}
        exact
      />
      <Route path={`${path}/transactions`} component={Transaction} exact />
      <Route path={`${path}/withdraw`} component={Withdraw} exact />
      <Route path={`${path}/add-money`} component={AddMoney} exact />
      <Route path={`${path}/notification`} component={MoreOption} exact />
      <Route path={`${path}/payment-complete/:id`} component={paymentComplete} exact />
    </Switch>
  );
}
