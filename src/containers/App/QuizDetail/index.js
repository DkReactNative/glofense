import {connect, useDispatch} from 'react-redux';
import React, {useEffect, useContext, useState} from 'react';
import {Link, Redirect} from 'react-router-dom';
import WebHeader from '../../../components/web-header';
import {getService} from '../../../services/getService';
import Buttom from '../../../components/buttomTabBar';
import Modal from 'react-bootstrap/Modal';
import Session from '../../../helpers/session';
import SocketContext from '../../../constants/socket-context';
import {showDangerToast, showToast} from '../../../components/toastMessage';
import {postService} from '../../../services/postService';
const QuizDetail = (props) => {
  const socket = useContext(SocketContext);
  const dispatch = useDispatch();

  var FromInvite = false;
  var inviteCode;

  var quizId = props.match.params.id;
  quizId = quizId.split(':');
  if (quizId.length === 1) {
    quizId = quizId[0];
  } else if (quizId[0] === 'FromInvite') {
    quizId = quizId[1];
    FromInvite = true;
    inviteCode = Session.getSession('inViteCode')
      ? Session.getSession('inViteCode').invite_code
      : null;
    if (!inviteCode) {
      showDangerToast('Sorry Invite code detail lost. Please try again');
      props.history.replace('/user');
    }
  } else {
    showDangerToast('Changing URL of Website are permitted');
    props.history.replace('/user');
  }

  socket.on('connect', () => {
    if (!socket.connected && FromInvite) {
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
  const [confirmModal, setConfirmModal] = useState(false);
  const [quizDetail, setQuizDetail] = useState({});
  const [effect, setEffect] = useState(true);

  useEffect(() => {
    getQuizDetail();
    if (FromInvite) {
      addHandler();
    }
  }, [effect]);

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

  const joinInviteUser = () => {
    let body = {};
    body['invite_code'] = inviteCode;
    postService(`join-invite-user`, JSON.stringify(body))
      .then((response) => {
        response = response.data;
        console.log(response);

        if (response.isDeactivate) {
          Session.clearItem('gloFenseUser');
          showDangerToast(
            'Your account has been deactivated. Please contact to admin.'
          );
          dispatch({type: 'logout', payload: null});
          props.history.replace('/');
        } else if (response.auth === 0) {
          showDangerToast(response.msg);
          props.history.replace('/user');
        } else if (response.success) {
          setConfirmModal(false)
          dispatch({
            type: 'reload_browser',
            payload: false,
          });
          dispatch({
            type: 'update_invite_match_detail',
            payload: response.results,
          });
          props.history.replace('/user/play-quiz/FromInvite:' + quizId);
        } else {
          showDangerToast(response.msg);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const CallJoinSingleQuiz = () => {
    console.log(quizDetail);
    let body = {};
    body['game_type'] = 'quiz';
    body['game_id'] = quizId;
    postService(`check-wallet`, JSON.stringify(body))
      .then((response) => {
        response = response.data;
        console.log(response);

        if (response.isDeactivate) {
          Session.clearItem('gloFenseUser');
          showDangerToast(
            'Your account has been deactivated. Please contact to admin.'
          );
          dispatch({type: 'logout', payload: null});
          props.history.replace('/');
        } else if (response.auth === 0) {
          showDangerToast(response.msg);
          props.history.replace('/user');
        } else if (response.success) {
          let dataResponse = response.results;
          var contestBalance = {};
          contestBalance.cashBalance = dataResponse.cashBalance
            ? parseFloat(dataResponse.cashBalance)
            : 0.0;
          contestBalance.winningBalance = dataResponse.winningBalance
            ? parseFloat(dataResponse.winningBalance)
            : 0.0;
          contestBalance.usableBalance = dataResponse.usableBonus
            ? parseFloat(dataResponse.usableBonus)
            : 0.0;
          contestBalance.entryFee = dataResponse.entryFee
            ? parseFloat(dataResponse.entryFee)
            : 0.0;
          contestBalance.useableBonousPercent = dataResponse.useableBonousPercent
            ? parseFloat(dataResponse.useableBonousPercent)
            : 0.0;

          if (
            contestBalance.entryFee -
              (contestBalance.usableBalance +
                contestBalance.cashBalance +
                contestBalance.winningBalance) <=
            0
          ) {
            setConfirmModal(true);
          } else {
            let remainingBalance =
              contestBalance.entryFee -
              (contestBalance.usableBalance +
                contestBalance.cashBalance +
                contestBalance.winningBalance);

            showDangerToast(
              `Low balance!. Please add ₹  ${remainingBalance} to join contest.`
            );
            window.alert(
              `Low balance!. Please add ₹  ${remainingBalance} to join contest.`
            );
            props.history.replace('/user/my-account');
          }
        } else {
          showDangerToast(response.msg);
          props.history.replace('/user/my-account');
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
        if (response.success) setQuizDetail(response.results);
      })
      .catch((err) => {});
  };

  return (
    <>
      <section className="body-inner-P">
        <div className="web-container">
          <div className="web-bg">
            <div className="download-app-right">
              <div className="rules">
                <h4>Important Notes</h4>
                <p>
                  <i className="fas fa-check" />
                  There is NO PAUSE in-between a Game.
                </p>
                <p>
                  <i className="fas fa-check" /> You will LOSE if you leave
                  in-between game.
                </p>
                <p>
                  <i className="fas fa-check" /> You must have a stable internet
                  connection. You will lose if you disconnect!.
                </p>
                {quizDetail.quiz_rules && quizDetail.quiz_rules.trim() && (
                  <>
                    <h4>Rules for Quiz</h4>
                    <p>
                      <i className="fas fa-check" />
                      {quizDetail.quiz_rules}
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="web-left-container bgCurve">
            <div className="pageheaderouter">
              <div className="tab-content">
                <div className="tab-pane active" id="profile" role="tabpanel">
                  <div className="header_height">
                    <WebHeader
                      title={'Quiz Detail'}
                      history={props.history}
                      arrow={true}
                      share={true}
                      id={quizId}
                      onShare={() => {}}
                    />
                  </div>
                  <div className="contestquiz">
                    <div className="quiztab p-4">
                      <div className="quizboxouter">
                        <div className="quizdetails">
                          <div className="quizimg">
                            <Link to="#">
                              <img
                                src={
                                  quizDetail.category_id &&
                                  quizDetail.category_id.image
                                    ? quizDetail.category_id.image
                                    : require('../../../assets/img/logo.png')
                                }
                                className="img-fluid"
                                alt="#"
                              />
                            </Link>
                          </div>
                          <div className="quizcontent">
                            <Link to="#">
                              <h4>
                                {quizDetail.name ? quizDetail.name : 'NA'}
                              </h4>
                            </Link>
                            <p className="mb-0">
                              {quizDetail.description
                                ? quizDetail.description
                                : 'NA'}
                            </p>
                          </div>
                          <button
                            className={`btn ${
                              quizDetail.status === 'active'
                                ? 'activebtn'
                                : 'inactivebtn'
                            }`}
                          >
                            {quizDetail.status === 'active'
                              ? 'Active'
                              : 'Inactive'}
                          </button>
                        </div>
                        <div className="quizamounts">
                          <div className="text-center">
                            <p>Total Questions</p>
                            <span>
                              {quizDetail.questions_count
                                ? quizDetail.questions_count
                                : 'NA'}
                            </span>
                          </div>
                          <div className="text-center">
                            <p>Winning Amount</p>
                            <span>
                              {quizDetail.winning_amount
                                ? quizDetail.winning_amount
                                : 0}{' '}
                              ₹
                            </span>
                          </div>
                          <div className="text-center">
                            <p>Entry Fee</p>
                            <span>
                              {' '}
                              {quizDetail.quiz_type &&
                              quizDetail.quiz_type === 'free'
                                ? 'free'
                                : `${
                                    quizDetail.entry_fee
                                      ? quizDetail.entry_fee
                                      : 0
                                  } ₹`}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="joinbtn text-center">
                        <button
                          className="btn"
                          onClick={() => {
                            if (FromInvite) {
                              CallJoinSingleQuiz();
                            } else {
                              props.history.push(
                                '/user/choose-language/quiz:' + quizId
                              );
                            }
                          }}
                        >
                          Join the Quiz
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <Buttom active={'home'} />
            </div>
          </div>
        </div>
      </section>
      <Modal
        aria-labelledby="exampleModalLabel"
        dialogClassName="modal-dialog"
        className="confirmations modalresize"
        show={confirmModal}
        onHide={() => {
          setConfirmModal(false);
        }}
      >
        <Modal.Header className="modal-header p-0 border-0 pt-2 pr-2">
          <button
            type="button"
            className="close"
            data-dismiss="modal"
            aria-label="Close"
            onClick={() => {
              setConfirmModal(false);
            }}
          >
            <span aria-hidden="true">×</span>
          </button>
        </Modal.Header>
        <Modal.Body className="modal-body pt-0">
          <div className="confirmationmodal">
            <h5>Confirmation</h5>
            <p>
              Unutilized Balance + Winnings= ₹{' '}
              {user.total_balance || user.total_balance === 0
                ? quizDetail.winning_amount || quizDetail.winning_amount === 0
                  ? user.total_balance + quizDetail.winning_amount
                  : user.total_balance || user.total_balance === 0
                : 'NA'}
            </p>
          </div>
          <div className="enteryfees">
            <p>
              Entry Fee{' '}
              <span>
                ₹{' '}
                {quizDetail.entry_fee || quizDetail.entry_fee === 0
                  ? quizDetail.entry_fee
                  : 'NA'}
              </span>
            </p>
            <p>
              Usable Cash Bonus
              <i className="fas fa-info-circle">
                <span className="d-none">
                  <small>Max 10% of total entry fee* per match</small>
                  <small>* valid for Selected Contests only</small>
                  <small>* not valid for private contests</small>
                </span>
              </i>
              <span>
                ₹{' '}
                {quizDetail.bonus || quizDetail.bonus === 0
                  ? quizDetail.bonus
                  : 'NA'}
              </span>
            </p>
            <hr />
            <p className="totalpay">
              To Pay{' '}
              <span>
                ₹{' '}
                {quizDetail.entry_fee || quizDetail.entry_fee === 0
                  ? quizDetail.bonus || quizDetail.bonus === 0
                    ? quizDetail.entry_fee - quizDetail.bonus
                    : quizDetail.entry_fee || quizDetail.entry_fee === 0
                  : 'NA'}
              </span>
            </p>
          </div>
          <p className="alertmessage text-center mt-4">
            By joining this contest you accept T &amp; C and confirm that you
            are not a resident of Assam Odisha, Telengana Sikkim.
          </p>
          <div className="joinbtn text-center">
            <button
              className="btn mb-2"
              onClick={() => {
                joinInviteUser();
              }}
            >
              Join The Quiz
            </button>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

const mapStateToProps = function (state) {
  return {
    state: state,
  };
};

export default connect(mapStateToProps)(QuizDetail);
