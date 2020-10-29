import {connect, useDispatch} from 'react-redux';
import React, {useEffect, useState} from 'react';
import {Link, Redirect} from 'react-router-dom';
import Modal from 'react-bootstrap/Modal';
import WebBg from '../../../components/web-bg';
import Buttom from '../../../components/buttomTabBar';
import WebHeader from '../../../components/web-header';
import {getService} from '../../../services/getService';
import {showDangerToast} from '../../../components/toastMessage';
import Session from '../../../helpers/session';
import {postService} from '../../../services/postService';
const Changelanguage = (props) => {
  const params = props.match.params.id.split(':');
  const dispatch = useDispatch();
  const [user, setUser] = useState(
    props.state && props.state.user ? props.state.user : {}
  );
  const [quizDetail, SetQuizDetail] = useState({});
  const [effect, setEffect] = useState(true);
  const [confirmModal, setConfirmModal] = useState(false);
  var language = {
    english: [{key: 'English', value: 'english'}],
    english_hindi: [
      {key: 'English', value: 'english'},
      {key: 'Hindi', value: 'hindi'},
    ],
    hindi: [{key: 'Hindi', value: 'hindi'}],
  };
  useEffect(() => {
    getQuizDetail();
    window.removeEventListener('beforeunload', () => {});
    window.removeEventListener('blur', () => {});
    document.removeEventListener('fullscreenchange', () => {});
    document.removeEventListener('mozfullscreenchange', () => {});
    document.removeEventListener('MSFullscreenChange', () => {});
    document.removeEventListener('webkitfullscreenchange', () => {});
    window.removeEventListener('onstatepop', () => {});
    return () => {
      dispatch({
        type: 'reload_browser',
        payload: false,
      });
    };
  }, [effect]);

  const getQuizDetail = () => {
    getService(
      `${
        params[0] === 'quiz'
          ? 'get-quiz'
          : params[0] === 'contest'
          ? 'get-contest'
          : ''
      }/${params[1]}`
    )
      .then((response) => {
        response = response['data'];

        if (response.success) {
          if (
            quizDetail.quiz_language === 'english' ||
            quizDetail.quiz_language === 'hindi'
          ) {
            dispatch({
              type: 'update_profile',
              payload: {language: quizDetail.quiz_language},
            });
          }
          SetQuizDetail(response.results);
        }
      })
      .catch((err) => {});
  };
  const CallJoinSingleQuiz = () => {
    console.log(quizDetail);
    let body = {};
    body['game_type'] = 'quiz';
    body['game_id'] = params[1];
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
  return (
    <>
      <section className="body-inner-P">
        <div className="web-container">
          <WebBg />
          <div className="web-left-container bgCurve">
            <div className="pageheaderouter">
              <div className="tab-pane active" id="profile" role="tabpanel">
                <div className="header_height">
                  <WebHeader
                    title={'Start Quiz'}
                    history={props.history}
                    arrow={true}
                  />
                </div>
                <div className="selectlengugequiz">
                  <h4>Please select your preferred language for the quiz?</h4>
                  <div className="d-flex">
                    {quizDetail.quiz_language &&
                      language[quizDetail.quiz_language].map((ele, i) => {
                        return (
                          <button
                            className={`btn ${
                              ele.value === user.language
                                ? 'language-active'
                                : ''
                            }`}
                            key={ele.value}
                            onClick={() => {
                              setUser({...user, ...{language: ele.value}});
                              dispatch({
                                type: 'update_profile',
                                payload: {language: ele.value},
                              });
                            }}
                          >
                            {ele.key}
                          </button>
                        );
                      })}
                    {}
                  </div>
                </div>
                <div className="joinbtn text-center">
                  <button
                    className="btn"
                    onClick={() => {
                      CallJoinSingleQuiz();
                    }}
                  >
                    Start Quiz
                  </button>
                </div>
              </div>
            </div>
            <Buttom active={'home'} />
          </div>
        </div>
      </section>

      {/* modal design */}

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
                dispatch({
                  type: 'reload_browser',
                  payload: false,
                });
                props.history.push('/user/play-quiz/' + params[1]);
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

export default connect(mapStateToProps)(Changelanguage);
