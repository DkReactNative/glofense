import {connect} from 'react-redux';
import {Link, Redirect, useRouteMatch} from 'react-router-dom';
import AppRoute from '../../routes/appRoute';
import React, {useEffect, useState} from 'react';
import {useDispatch} from 'react-redux';
import Session from '../../helpers/session';
import Modal from 'react-bootstrap/Modal';
import {showDangerToast} from '../../components/toastMessage';
const App = (props) => {
  let {path, url} = useRouteMatch();
  console.log('path,url,pathname=>', path, url, window.location.pathname);
  var href = window.location.href;
  const dispatch = useDispatch();
  const [confirmModal, setModal] = useState(true);
  const [user, setUser] = useState(
    props.state && props.state.user ? props.state.user : {}
  );
  useEffect(() => {
    console.log('href =>', href);
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
    if (
      !props.state.user.dob &&
      window.location.pathname !== '/user/edit-profile'
    ) {
      setModal(true);
    } else {
      setModal(false);
    }
    if (!user.token || user.token === '') {
      showDangerToast(
        'Authentication token is missing. Please try to login again'
      );
      Session.clearItem('gloFenseUser');
      dispatch({type: 'logout', payload: null});
    }
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
      <Modal
        aria-labelledby="exampleModalLabel"
        dialogClassName="modal-dialog"
        backdrop="static"
        keyboard={false}
        className="confirmations modalresize"
        show={confirmModal}
        onHide={() => {
          setModal(false);
        }}
      >
        <Modal.Body>
          <div className="update-profile-modal">
            <h1>Profile Update</h1>
            <h5>Please update your profile first.</h5>
            <Link
              to="/user/edit-profile"
              onClick={() => {
                setModal(false);
              }}
            >
              UPDATE
            </Link>
          </div>
        </Modal.Body>
      </Modal>
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
            <Link to="/user/profile" className="closeMenu">
              <i className="fas fa-home closeMenu" /> My Profile
            </Link>
          </li>
          <li>
            <Link to="/user/my-account" className="closeMenu">
              <i className="fas fa-wallet closeMenu" /> My balance
            </Link>
          </li>
          <li>
            <Link to="/user/notification" className="closeMenu">
              <i className="fas fa-bell closeMenu" /> Notifications
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
