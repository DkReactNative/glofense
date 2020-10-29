import {connect, useDispatch} from 'react-redux';
import React, {useEffect, useState} from 'react';
import {Link, Redirect} from 'react-router-dom';
import WebHeader from '../../../components/web-header';
import {getService} from '../../../services/getService';
import {postService} from '../../../services/postService';
import Modal from 'react-bootstrap/Modal';
import Buttom from '../../../components/buttomTabBar';
import Session from '../../../helpers/session';
import {formateDate} from '../../../helpers/commonHelpers';
import {showDangerToast, showToast} from '../../../components/toastMessage';
const ContestDetail = (props) => {
  const dispatch = useDispatch();
  const quizId = props.match.params.id;
  const [user, setUser] = useState(
    props.state && props.state.user ? props.state.user : {}
  );
  const [contestDetail, setContestDetail] = useState({});
  const [effect, setEffect] = useState(true);
  const [confirmModal, setConfirmModal] = useState(false);
  useEffect(() => {
    getContestDetail();
    return () => {};
  }, [effect]);

  const jointContest = () => {
    postService(`join-contest`, JSON.stringify({contest_id: quizId}))
      .then((response) => {
        setConfirmModal(false);
        response = response['data'];
        if (response.success) {
          showToast(response.msg);
          props.history.goBack();
        } else {
          showDangerToast(response.msg);
        }
      })
      .catch((err) => {
        setConfirmModal(false);
        showDangerToast(err.message);
      });
  };

  const getContestDetail = () => {
    getService(`get-contest/${quizId}`)
      .then((response) => {
        response = response['data'];
        response.results['left_slot'] =
          response.results.users_limit - response.results.joined_user_count;
        response.results[
          'left_slot'
        ] = response.results.left_slot.toLocaleString();
        response.results[
          'total_slot'
        ] = response.results.users_limit.toLocaleString();
        if (response.success) setContestDetail(response.results);
      })
      .catch((err) => {});
  };

  const CallJoinContest = () => {
    let body = {};
    body['game_type'] = 'contest';
    body['game_id'] = props.state.gameId.gameId;
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
      {contestDetail && (
        <section className="body-inner-P">
          <div className="web-container">
            <div className="web-bg">
              <div className="download-app-right">
                <div className="bg-header">
                  <h3 className="prize-break-up">Prize Breakup</h3>
                </div>
                <div className="rules" style={{paddingTop: 10}}>
                  <h3 className="text-total-winning">Total Winning Amount</h3>
                  <p className="text-total-rs">
                    ₹ {contestDetail.winning_amount}
                  </p>
                  <div className="prize-breakup-view">
                    {contestDetail &&
                      contestDetail.price_breakup &&
                      contestDetail.price_breakup.map((ele, index) => {
                        return (
                          <div
                            className="prize-innner-block"
                            // style={{background: index % 2 !== 0 ? 'white' : ''}}
                          >
                            <p>
                              Rank{' '}
                              {ele.start_rank +
                                (ele.end_rank > ele.start_rank
                                  ? '-' + ele.end_rank
                                  : '')}
                            </p>
                            <p>₹ {ele.each_price}</p>
                          </div>
                        );
                      })}
                  </div>
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
                    <i className="fas fa-check" /> You must have a stable
                    internet connection. You will lose if you disconnect!.
                  </p>
                  {contestDetail.contest_rules &&
                    contestDetail.contest_rules.trim() && (
                      <>
                        <h4>Rules for Contest</h4>
                        <p>
                          <i className="fas fa-check" />
                          {contestDetail.contest_rules}
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
                        title={'Contest Detail'}
                        history={props.history}
                        arrow={true}
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
                                    contestDetail.image
                                      ? contestDetail.image
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
                                  {contestDetail.name
                                    ? contestDetail.name
                                    : 'NA'}
                                </h4>
                              </Link>
                              <p className="mb-0">
                                {contestDetail.description
                                  ? contestDetail.description
                                  : 'NA'}
                              </p>
                            </div>
                            <button className={`btn ${'activebtn'}`}>
                              Active
                            </button>
                          </div>
                          <div className="quizamounts">
                            <div className="text-center">
                              <p>Total Questions</p>
                              <span>
                                {contestDetail.questions_count
                                  ? contestDetail.questions_count
                                  : 'NA'}
                              </span>
                            </div>
                            <div className="text-center">
                              <p>Winning Amount</p>
                              <span>
                                {contestDetail.winning_amount
                                  ? contestDetail.winning_amount
                                  : 0}{' '}
                                ₹
                              </span>
                            </div>
                            <div className="text-center">
                              <p>Entry Fee</p>
                              <span>
                                {' '}
                                {contestDetail.quiz_type &&
                                contestDetail.quiz_type === 'free'
                                  ? 'free'
                                  : `${
                                      contestDetail.entry_fee
                                        ? contestDetail.entry_fee
                                        : 0
                                    } ₹`}
                              </span>
                            </div>
                          </div>
                          <div className="statusouter">
                            <div className="bar-three bar-con">
                              {contestDetail.joined_user_count &&
                                contestDetail.total_slot && (
                                  <div
                                    className="bar"
                                    data-percent={
                                      (contestDetail.joined_user_count /
                                        contestDetail.total_slot.replace(
                                          /\D/g,
                                          ''
                                        )) *
                                      100
                                    }
                                    style={{
                                      width:
                                        (contestDetail.joined_user_count /
                                          contestDetail.total_slot.replace(/\D/g, '')) *
                                          100 +
                                        '%',
                                    }}
                                  />
                                )}
                            </div>
                            <div className="d-flex">
                              <span>
                                Only {contestDetail.left_slot} spots left
                              </span>{' '}
                              <span>{contestDetail.total_slot} Teams</span>
                            </div>
                          </div>
                          <div className="timezoon d-flex">
                            <div className="starttime">
                              <p>Start Time</p>
                              {contestDetail.start_date ? (
                                <span>
                                  {formateDate(
                                    new Date(contestDetail.start_date),
                                    'DD MMM, hh:mm A'
                                  )}
                                </span>
                              ) : (
                                'NA'
                              )}
                            </div>
                            <div className="starttime">
                              <p>End Time</p>
                              {contestDetail.end_date ? (
                                <span>
                                  {formateDate(
                                    new Date(contestDetail.end_date),
                                    'DD MMM, hh:mm A'
                                  )}
                                </span>
                              ) : (
                                'NA'
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="joinbtn text-center">
                          <button
                            className="btn"
                            onClick={() => {
                              CallJoinContest();
                            }}
                          >
                            Join the contest
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
      )}

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
                ? contestDetail.winning_amount ||
                  contestDetail.winning_amount === 0
                  ? user.total_balance + contestDetail.winning_amount
                  : user.total_balance || user.total_balance === 0
                : 'NA'}
            </p>
          </div>
          <div className="enteryfees">
            <p>
              Entry Fee{' '}
              <span>
                ₹{' '}
                {contestDetail.entry_fee || contestDetail.entry_fee === 0
                  ? contestDetail.entry_fee
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
                {contestDetail.bonus || contestDetail.bonus === 0
                  ? contestDetail.bonus
                  : 'NA'}
              </span>
            </p>
            <hr />
            <p className="totalpay">
              To Pay{' '}
              <span>
                ₹{' '}
                {contestDetail.entry_fee || contestDetail.entry_fee === 0
                  ? contestDetail.bonus || contestDetail.bonus === 0
                    ? contestDetail.entry_fee - contestDetail.bonus
                    : contestDetail.entry_fee || contestDetail.entry_fee === 0
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
                jointContest();
              }}
            >
              Join The Contest
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

export default connect(mapStateToProps)(ContestDetail);
