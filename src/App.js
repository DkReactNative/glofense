import React, {Component} from 'react';
import {BrowserRouter, Route, Redirect, Switch} from 'react-router-dom';
import Auth from '../src/containers/Auth';
import Application from '../src/containers/App';
import {connect} from 'react-redux';
import deviceIfo from '../src/helpers/deviceInfo';
import Loader from '../src/components/loader';
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';
import 'react-datepicker/dist/react-datepicker.css';
import SocketContext from './constants/socket-context';
import * as io from 'socket.io-client';
console.log(process.env);
const socket = io(process.env.REACT_APP_API_BASE_URL, {
  secure: true,
  rejectUnauthorized: false,
  path: '',
});

console.log(socket);
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount = () => {
    socket.on('connect', function() {
      console.log('socket connected', socket.connected);
    });
    this.props.storeDevice(deviceIfo());
  };

  render() {
    return (
      <SocketContext.Provider value={socket}>
        <BrowserRouter>
          {/* <Loader loading={true} /> */}
          <Switch>
            {/* <Route path="/user" component={Application} /> */}
            <Route
              path="/user"
              render={() =>
                this.props.user ? <Application /> : <Redirect to="/" />
              }
            />
            <Route path="/" component={Auth} />
          </Switch>
        </BrowserRouter>
      </SocketContext.Provider>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    deviceInfo: state.deviceInfo,
    loading: state.loading,
    user: state.user,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    storeDevice: (data) => {
      dispatch({type: 'update', payload: data});
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
