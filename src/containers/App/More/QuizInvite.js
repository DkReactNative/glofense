import {connect} from 'react-redux';
import React, {useEffect, useState} from 'react';
import {Link, Redirect} from 'react-router-dom';
import WebBg from '../../../components/web-bg';
import {postService} from '../../../services/postService';
import Buttom from '../../../components/buttomTabBar';
import WebHeader from '../../../components/web-header';
import {showToast, showDangerToast} from '../../../components/toastMessage';
import Input from '../../../components/Input';
import Validation from '../../../validations/validation_wrapper';
var disable = false;
const QuizInvite = (props) => {
  const [effect, setEffect] = useState(true);
  const [invideCode, setCode] = useState('');
  const [codeError, SetError] = useState('');

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [effect]);

  const onClickJoin = () => {
    if (disable) return;
    disable = 1;
    let codeError = Validation('inviteCode', invideCode);
    if (codeError) {
      SetError(codeError);
      disable = false;
      return;
    }

    let body = {};
    body['invite_code'] = invideCode;
    postService('verify-invite-code', JSON.stringify(body))
      .then((response) => {
        response = response.data;
        disable = false;
        if (response.success) {
          showToast(response.msg);
          this.props.updateLoginform();
        } else {
          showDangerToast(response.msg);
        }
      })
      .catch((err) => {
        disable = false;
        console.log(err);
        showDangerToast(err.message);
      });
  };

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
          <div className="contestquiz mt-5">
            <div className="referalpage">
              <div className="inviteouter">
                <h5 className="mb-2">Please enter your invite code</h5>
                <Input
                  type="text"
                  style={{padding: 20}}
                  name="loginInput"
                  className="form-control"
                  placeholder="Invite Code"
                  value={invideCode}
                  onBlur={(e) => {
                    setCode(e.target.value);
                    SetError(Validation('inviteCode', e.target.value));
                  }}
                  onChange={(e) => {
                    setCode(e.target.value);
                    SetError(Validation('inviteCode', e.target.value));
                  }}
                  error={codeError}
                />
              </div>
              <div className="joinbtn text-center mt-2">
                <button
                  className="btn"
                  onClick={() => {
                    onClickJoin();
                  }}
                >
                  Join Now
                </button>
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

export default connect(mapStateToProps)(QuizInvite);
