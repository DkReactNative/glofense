import {connect} from 'react-redux';
import React, {useEffect, useState} from 'react';
import {Link, Redirect} from 'react-router-dom';
import Share from '../../../components/shareCodeOptions';
import WebBg from '../../../components/web-bg';
import {getService} from '../../../services/getService';
import Buttom from '../../../components/buttomTabBar';
import WebHeader from '../../../components/web-header';
import {showToast} from '../../../components/toastMessage';
const ReferralCode = (props) => {
  const [user, setUser] = useState(
    props.state && props.state.user ? props.state.user : {}
  );
  var link;
  const [showShare, setShare] = useState(false);
  const [effect, setEffect] = useState(true);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [effect]);

  function copyToClipboard(text = '') {
    text = user.referral_code;
    var input = document.createElement('input');
    input.setAttribute('value', text);
    document.body.appendChild(input);
    input.select();
    var result = document.execCommand('copy');
    document.body.removeChild(input);
    if (result) {
      showToast('Copied');
    }
  }

  return (
    <section
      className="body-inner-P"
      onClick={() => {
        setShare(false);
      }}
    >
      <div className="web-container">
        <WebBg />
        <div className="tab-pane" id="messages" role="tabpanel">
          <div className="header_height">
            <WebHeader
              title={'REFERRAL CODE'}
              history={props.history}
              arrow={true}
            />
          </div>
          <div className="contestquiz mt-5 overflow-referal">
            <Share
              loading={showShare}
              code={user.referral_code}
              bonus={user.referred_amount}
              onHide={() => {
                setShare(false);
              }}
            />
            <div className="referalpage">
              <img
                src={require('../../../assets/img/referalbanner.png')}
                alt="#"
              />
              <div className="logoreferal text-center p-4">
                <img src={require('../../../assets/img/logo.png')} alt="#" />
              </div>
              <p className="mb-0">
                For every friend that plays. you both get <br /> &#x20B9;{' '}
                {user.referred_amount ? user.referred_amount : 0} for free
              </p>
              <ul className="referallist">
                <li>
                  <Link to="/user/more/how-it-works">How it works</Link>
                </li>
                <li>
                  <Link to="/user/more/fair-and-play">Rules for fair play</Link>
                </li>
              </ul>
              <div className="invitefriend">
                <h5>Share Your Invite Code</h5>
                <h3
                  onClick={() => {
                    copyToClipboard();
                  }}
                  style={{cursor: 'pointer'}}
                >
                  {user.referral_code}
                </h3>
                <div className="joinbtn text-center">
                  <button
                    className="btn mb-4"
                    onClick={(event) => {
                      event.stopPropagation();
                      setShare(true);
                    }}
                  >
                    Invite Friends
                  </button>
                </div>
              </div>
            </div>
          </div>
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

export default connect(mapStateToProps)(ReferralCode);
