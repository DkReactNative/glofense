import {connect} from 'react-redux';
import {Link, Redirect} from 'react-router-dom';
import AppRoute from '../../routes/appRoute';
import React, {useEffect, useState} from 'react';
import {useDispatch} from 'react-redux';
import Session from '../../helpers/session';
const App = (props) => {
  var href = window.location.href;
  const dispatch = useDispatch();
  const [user, setUser] = useState(
    props.state && props.state.user ? props.state.user : {}
  );
  useEffect(() => {
    document.getElementById('closebtn').onclick = (e) => {
      document.getElementById('glofensidebar').classList.remove('main');
    };
    document.querySelectorAll('.closeMenu').forEach((item) => {
      item.addEventListener('click', (event) => {
        document.getElementById('glofensidebar').classList.remove('main');
      });
    });
    document.getElementById('overlay').onclick = (e) => {
      document.getElementById('glofensidebar').classList.remove('main');
    };
  }, [user, props, href]);

  const onLogout = () => {
    if (window.confirm('Are you sure you want to log out?')) {
      Session.clearItem('gloFenseUser');
      dispatch({type: 'logout', payload: null});
    }
  };
  return (
    <>
      <AppRoute />

      {/* Homeburger menu */}
      <div className="glofensidebar" id="glofensidebar">
        <div className="sidebarheader">
          <span className="sidebaruserimg">
            <img src={user.image} alt="#" />
          </span>
          <div className="sidebaruserinfo">
            <h4>{user.first_name ? user.first_name : 'NA'}</h4>
            <p>{user.last_name ? user.first_name : ''}</p>
            <span
              className="closebtn"
              id="closebtn"
              onClick={() => {
                document
                  .getElementById('glofensidebar')
                  .classList.remove('main');
              }}
            >
              <i className="fas fa-times" />
            </span>
          </div>
        </div>
        <ul className="sidebarlisting">
          <li>
            <Link to="/user" className="closeMenu">
              <i className="fas fa-home closeMenu" /> Home
            </Link>
          </li>
          <li>
            <Link to="#" className="closeMenu">
              <i className="fas fa-wallet closeMenu" /> My balance
            </Link>
          </li>
          <li>
            <Link to="#" className="closeMenu">
              <i className="fas fa-bell closeMenu" /> Notification
            </Link>
          </li>
          <li>
            <Link
              to="#"
              onClick={() => {
                onLogout();
              }}
            >
              <i className="fas fa-sign-out-alt" /> Logout
            </Link>
          </li>
        </ul>
      </div>
      <span
        className="overlay"
        id="overlay"
        onClick={() => {
          document.getElementById('glofensidebar').classList.remove('main');
        }}
      ></span>
    </>
  );
};

const mapStateToProps = function (state) {
  return {
    state: state,
  };
};

export default connect(mapStateToProps)(App);
