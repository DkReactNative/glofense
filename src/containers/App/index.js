import {connect} from 'react-redux';
import React from 'react';
import AppRoute from '../../routes/appRoute';

const App = (props) => {
  return (
    <>
      <AppRoute />
      <div className="glofensidebar main">
        <div className="sidebarheader">
          <span className="sidebaruserimg">
            <img src="img/winneruser.png" alt="#" />
          </span>
          <div className="sidebaruserinfo">
            <h4>Stive smith</h4>
            <p>stive smith....</p>
            <span className="closebtn">
              <i className="fas fa-times" />
            </span>
          </div>
        </div>
        <ul className="sidebarlisting">
          <li>
            <a href="#">
              <i className="fas fa-home" /> Home
            </a>
          </li>
          <li>
            <a href="#">
              <i className="fas fa-wallet" /> My balance
            </a>
          </li>
          <li>
            <a href="#">
              <i className="fas fa-bell" /> Notification
            </a>
          </li>
          <li>
            <a href="#">
              <i className="fas fa-sign-out-alt" /> Logout
            </a>
          </li>
        </ul>
      </div>
      <span class="overlay"></span>
    </>
  );
};

const mapStateToProps = function (state) {
  return {
    state: state,
  };
};

export default connect(mapStateToProps)(App);
