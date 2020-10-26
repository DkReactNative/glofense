import {connect, useDispatch} from 'react-redux';
import React, {useEffect, useContext, useState} from 'react';
import {showToast, showDangerToast} from '../../../components/toastMessage';
import {postService} from '../../../services/postService';
import WebBg from '../../../components/web-bg';
import Buttom from '../../../components/buttomTabBar';
import WebHeader from '../../../components/web-header';
import SocketContext from '../../../constants/socket-context';
import Share from '../../../components/shareCodeOptions';
import {getService} from '../../../services/getService';
import Session from '../../../helpers/session';
var inviteCode;

const InviteCode = (props) => {
  const quizId = props.match.params.id;
  const socket = useContext(SocketContext);
  const dispatch = useDispatch();
  socket.on('connect', () => {
    if (!socket.connected) {
      showDangerToast(
        'Something went wrong while connecting. Please try again'
      );
      socket.io(process.env.REACT_APP_API_BASE_URL, {
        secure: true,
        rejectUnauthorized: false,
        path: '',
      });
      props.history.goBack();
    }
    console.log('socket connected', socket.connected);
  });
  const [user, setUser] = useState(
    props.state && props.state.user ? props.state.user : {}
  );
  const [quizDetail, setQuizDetail] = useState({});
  const [effect, setEffect] = useState(true);
  const [showShare, setShare] = useState(false);

  useEffect(() => {
    inviteCode =
      Math.random('abcdefghjklmnpqrstuvwxyz12345789')
        .toString(36)
        .substring(2, 5) +
      Math.random('abcdefghjklmnpqrstuvwxyz12345789')
        .toString(36)
        .substring(2, 5);
    document.body.style.overflow = 'hidden';
    getQuizDetail();
    addHandler();
    return () => {
      document.body.style.overflow = 'auto';
      dispatch({
        type: 'reload_browser',
        payload: false,
      });
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

  const addHandler = () => {
    let tempID = `startInviteGame_${user._id}`;
    socket.on(tempID, (data) => {
      console.log('startInviteGame__data--->', data);
      dispatch({
        type: 'reload_browser',
        payload: false,
      });
      dispatch({
        type: 'update_invite_match_detail',
        payload: data,
      });
      props.history.replace('/user/play-quiz/FromInvite:' + quizId);
    });
  };

  const onShare = (category_id) => {
    console.log(quizDetail);
    let body = {};
    body['quiz_id'] = quizId;
    body['quiz_cat'] = category_id;
    body['invite_code'] = inviteCode;
    postService(`invite-user`, JSON.stringify(body))
      .then((response) => {
        response = response.data;
        console.log(response);
        if (response.success) {
          showToast(response.msg);
          response = response.results;
        } else {
          showDangerToast(response.msg);
          if (response.isDeactivate) {
            Session.clearItem('gloFenseUser');
            dispatch({type: 'logout', payload: null});
            props.history.replace('/');
          } else {
            props.history.replace('/user');
          }
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getQuizDetail = () => {
    getService(`get-quiz/${quizId}`)
      .then((response) => {
        response = response['data'];
        console.log(response);
        if (response.success) {
          setQuizDetail(response.results);
          onShare(response.results.category_id._id);
        }
      })
      .catch((err) => {});
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
