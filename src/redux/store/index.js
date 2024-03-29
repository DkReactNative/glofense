import {createStore, applyMiddleware, combineReducers} from 'redux';
import thunk from 'redux-thunk';
import {composeWithDevTools} from 'redux-devtools-extension/logOnlyInProduction';
import ProfileReducer from '../reducers/profileReducer';
import DeviceInfo from '../reducers/DeviceInfoReducer';
import LoadingReducer from '../reducers/loadingReducer';
import LoginFormReducer from '../reducers/loginFormReducer';
import ActiveClassReducer from '../reducers/activeClassReducer';
import QuizReducer from '../reducers/quizReducer';
import inviteMatchDetail from '../reducers/inviteMatchDetail';
import RefreshBrowser from '../reducers/browserReload';
import GameIdReducer from '../reducers/gameIdReducer';
var rootReducer = combineReducers({
  user: ProfileReducer,
  deviceInfo: DeviceInfo,
  loading: LoadingReducer,
  loginForm: LoginFormReducer,
  activeClass: ActiveClassReducer,
  quizData: QuizReducer,
  browserReload: RefreshBrowser,
  inviteMatchDetail: inviteMatchDetail,
  gameId: GameIdReducer,
});

function configureStore(state = {rotating: true}) {
  return createStore(rootReducer, composeWithDevTools(applyMiddleware(thunk)));
}

export default configureStore;
