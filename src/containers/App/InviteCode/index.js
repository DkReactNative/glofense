import {connect} from 'react-redux';
import React, {useEffect, useState} from 'react';
import WebBg from '../../../components/web-bg';
import Buttom from '../../../components/buttomTabBar';
import WebHeader from '../../../components/web-header';
import {showToast} from '../../../components/toastMessage';
import Share from '../../../components/shareCodeOptions';
const inviteCode =
    Math.random().toString(36).substring(2, 5) +
    Math.random().toString(36).substring(2, 5);
const InviteCode = (props) => {
  const [user, setUser] = useState(
    props.state && props.state.user ? props.state.user : {}
  );
  const [effect, setEffect] = useState(true);
  const [showShare, setShare] = useState(false);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [effect]);

  function copyToClipboard(text = '') {
    text = inviteCode;
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
    <section className="body-inner-P">
      <div className="web-container">
        <WebBg />

        <div className="tab-pane" id="messages" role="tabpanel">
          <div className="header_height">
            <WebHeader
              title={'QUIZ INVITE CODE'}
              history={props.history}
              arrow={true}
            />
          </div>
          <Share
            loading={showShare}
            code={user.referral_code}
            bonus={user.referred_amount}
            onHide={() => {
              setShare(false);
            }}
            message={`Please use this invite code ${inviteCode} and play quiz with me`}
          />
          <div className="innerpagecontent invite-code-inner">
            <h3>Most important Note Please Read carefully</h3>
            <p>
              1. Once you shared the code do not leasve this screen. if you
              leave this screen or close the application your shared code will
              be invalid.
            </p>
            <p>
              2. Your amount will be automatically deducated once shared user
              join the quiz.
            </p>
            <p>
              3. You will be automatically redirect to quiz section once other
              join this quiz.
            </p>

            <h1
              onClick={() => {
                copyToClipboard();
              }}
            >
              {inviteCode}
            </h1>
            <div className="joinbtn text-center mt-2">
              <button
                className="btn"
                onClick={(event) => {
                  event.stopPropagation();
                  setShare(true);
                }}
              >
                Share Code Now
              </button>
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

export default connect(mapStateToProps)(InviteCode);
