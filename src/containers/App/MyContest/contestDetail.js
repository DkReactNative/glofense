import {connect, useDispatch} from 'react-redux';
import React, {useEffect, useState} from 'react';
import {Link, Redirect} from 'react-router-dom';
import WebHeader from '../../../components/web-header';
import {getService} from '../../../services/getService';
import Buttom from '../../../components/buttomTabBar';
import WebBg from '../../../components/web-bg';
import Timer from '../../../components/timer';
import {formateDate} from '../../../helpers/commonHelpers';
const MyContestDetail = (props) => {
  const dispatch = useDispatch();
  const quizId = props.match.params.id;
  const [user, setUser] = useState(
    props.state && props.state.user ? props.state.user : {}
  );
  const [contestDetail, setContestDetail] = useState({});
  const [effect, setEffect] = useState(true);
  useEffect(() => {
    getContestDetail();
    return () => {};
  }, [effect]);

  const returnSeconds = (startDate, endDate) => {
    var date1 = new Date(startDate);
    var date2 = new Date(endDate);
    var diff = (date1 - date2) / 1000;
    return diff;
  };

  const getContestDetail = () => {
    getService(`get-contest/${quizId}`)
      .then((response) => {
        response = response['data'];
        if (response.success) {
          let me = null;
          response.results['left_slot'] =
            response.results.users_limit - response.results.joined_user_count;
          response.results[
            'left_slot'
          ] = response.results.left_slot.toLocaleString();
          response.results[
            'total_slot'
          ] = response.results.users_limit.toLocaleString();
          response.results.joined_users = response.results.joined_users.filter(
            (ele) => {
              if (ele.user_id._id !== user._id) {
                return ele;
              } else {
                me = ele;
              }
            }
          );
          if (me) {
            response.results.joined_users.unshift(me);
          }
          response.results.counter = returnSeconds(
            response.results.start_date,
            response.current_date
          );
          setContestDetail(response.results);
        }
      })
      .catch((err) => {});
  };

  return (
    <section className="body-inner-P">
      <div className="web-container">
        <WebBg />
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
                          <Link href="#">
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
                            <h4>Hot Quiz</h4>
                          </Link>
                          <p className="mb-0">Get ready for big winnings</p>
                        </div>
                        <button className="btn activebtn">Active</button>
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
                                      contestDetail.total_slot.replace(
                                        /\D/g,
                                        ''
                                      )) *
                                      100 +
                                    '%',
                                }}
                              />
                            )}
                        </div>
                        <div className="d-flex">
                          <span>Only {contestDetail.left_slot} spots left</span>{' '}
                          <span>{contestDetail.total_slot} Teams</span>
                        </div>
                      </div>
                      <div className="timezoon d-flex">
                        <div className="starttime">
                          <p>Start Time</p>
                          <span>
                            {' '}
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
                          </span>
                        </div>
                        <div className="starttime">
                          <p>End Time</p>
                          <span>
                            {' '}
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
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="joinbtn text-center">
                      <button className="btn mb-3">
                        {props.state.gameId &&
                        props.state.gameId.status === 'completed' ? (
                          'Completed'
                        ) : (
                          <Timer
                            counter={
                              contestDetail.counter > 0
                                ? contestDetail.counter
                                : 0
                            }
                            onFinish={() => {
                              dispatch({
                                type: 'reload_browser',
                                payload: false,
                              });
                              props.history.replace(
                                '/user/play-contest/' + quizId
                              );
                            }}
                          />
                        )}
                      </button>
                    </div>
                    <div className="bottomtabs">
                      <div className="list-group" id="myList" role="tablist">
                        <a
                          className="list-group-item list-group-item-action active"
                          data-toggle="list"
                          href="#prizebrekup"
                          role="tab"
                        >
                          Prize Brekup
                        </a>
                        <a
                          className="list-group-item list-group-item-action"
                          data-toggle="list"
                          href="#Leaderboard"
                          role="tab"
                        >
                          Leaderboard
                        </a>
                      </div>
                      <div className="tab-content">
                        <div
                          className="tab-pane active"
                          id="prizebrekup"
                          role="tabpanel"
                        >
                          <div className="topranksmoney">
                            {contestDetail &&
                              contestDetail.price_breakup &&
                              contestDetail.price_breakup.map((ele, index) => {
                                return (
                                  <p>
                                    Rank{' '}
                                    {ele.start_rank +
                                      (ele.end_rank > ele.start_rank
                                        ? '-' + ele.end_rank
                                        : '')}{' '}
                                    <span>₹ {ele.each_price}</span>
                                  </p>
                                );
                              })}
                          </div>
                          <div className="tremsconditions">
                            <h4>Important Note</h4>
                            <p>1. There is NO PAUSE in-between a Game.</p>
                            <p>
                              2. You will LOSE if you leave in-between game.
                            </p>
                            <p>
                              3. You must have a stable internet connection. you
                              will lose if you dicoonnect!
                            </p>
                          </div>
                        </div>
                        <div
                          className="tab-pane"
                          id="Leaderboard"
                          role="tabpanel"
                        >
                          <div className="Leaderboardlisting">
                            <ul>
                              {contestDetail &&
                                contestDetail.joined_users &&
                                contestDetail.joined_users.map((ele, index) => {
                                  if (ele.user_id) {
                                    return (
                                      <li>
                                        <div className="leftpart">
                                          <span className="userimg">
                                            <img
                                              src={ele.user_id.image}
                                              alt="#"
                                            />
                                          </span>
                                          <span className="nameuser">
                                            {ele.user_id.first_name +
                                              ' ' +
                                              ele.user_id.last_name}
                                          </span>
                                        </div>
                                      </li>
                                    );
                                  }
                                })}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <Buttom active={'my-contest'} />
          </div>
        </div>
      </div>
    </section>
  );
};

const mapStateToProps = function (state) {
  return {
    state: state,
  };
};

export default connect(mapStateToProps)(MyContestDetail);
