import {connect, useDispatch} from 'react-redux';
import React, {useEffect, useState} from 'react';
import {Link, Redirect} from 'react-router-dom';
import WebBg from '../../../components/web-bg';
import Session from '../../../helpers/session';
import Buttom from '../../../components/buttomTabBar';
import WebHeader from '../../../components/web-header';
const MoreOption = (props) => {
  const [effect, setEffect] = useState(true);
  const dispatch = useDispatch();
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [effect]);

  const onLogout = () => {
    if (window.confirm('Are you sure you want to log out?')) {
      Session.clearItem('gloFenseUser');
      dispatch({type: 'logout', payload: null});
    }
  };

  return (
    <section className="body-inner-P">
      <div className="web-container">
        <WebBg />

        <div className="tab-pane" id="messages" role="tabpanel">
          <div className="header_height">
            <WebHeader title={'MORE'} />
          </div>
          <ul className="moreopctionslist">
            <li>
              <Link to="/user/my-account" className="closeMenu">
                <i className="fas fa-wallet closeMenu" /> My balance
                <span className="rightarrow">
                  <i className="fas fa-chevron-right"></i>
                </span>
              </Link>
            </li>
            <li>
              <Link to="/user/referral-code">
                <i className="fas fa-user-plus"></i> Referral Code{' '}
                <span className="rightarrow">
                  <i className="fas fa-chevron-right"></i>
                </span>
              </Link>
            </li>
            <li>
              <Link to="/user/invite-quiz">
                <i className="fas fa-envelope-open-text"></i> Quiz Invite COde{' '}
                <span className="rightarrow">
                  <i className="fas fa-chevron-right"></i>
                </span>
              </Link>
            </li>
            <li>
              <Link to="/user/more/how-to-play">
                <i className="fab fa-python"></i> How to play{' '}
                <span className="rightarrow">
                  <i className="fas fa-chevron-right"></i>
                </span>
              </Link>
            </li>
            <li>
              <Link to="/user/more/faq">
                <i className="fas fa-question-circle"></i> FAQ{' '}
                <span className="rightarrow">
                  <i className="fas fa-chevron-right"></i>
                </span>
              </Link>
            </li>
            <li>
              <Link to="/user/more/about-us">
                <i className="fas fa-info-circle"></i> About Us{' '}
                <span className="rightarrow">
                  <i className="fas fa-chevron-right"></i>
                </span>
              </Link>
            </li>
            <li>
              <Link to="/user/more/terms-and-conditions">
                <i className="fas fa-file-alt"></i> Terms and Condition{' '}
                <span className="rightarrow">
                  <i className="fas fa-chevron-right"></i>
                </span>
              </Link>
            </li>
            <li>
              <Link to="/user/more/privacy-policy">
                <i className="fas fa-user-shield"></i> Privacy Policy{' '}
                <span className="rightarrow">
                  <i className="fas fa-chevron-right"></i>
                </span>
              </Link>
            </li>
            <li
              onClick={() => {
                onLogout();
              }}
            >
              <Link to="#">
                <i className="fas fa-sign-out-alt"></i> Logout{' '}
                <span className="rightarrow">
                  <i className="fas fa-chevron-right"></i>
                </span>
              </Link>
            </li>
          </ul>
        </div>
        <Buttom active={'more'} />
      </div>
    </section>
  );
};

const mapStateToProps = function (state) {
  return {
    state: state,
  };
};

export default connect(mapStateToProps)(MoreOption);
