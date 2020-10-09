import {connect} from 'react-redux';
import React, {useEffect, useState} from 'react';
import {Link, Redirect} from 'react-router-dom';
import WebHeader from '../../../components/web-header';
import {getService} from '../../../services/getService';
import Buttom from '../../../components/buttomTabBar';
import {formateDate} from '../../../helpers/commonHelpers';
const ContestDetail = (props) => {
  const quizId = props.match.params.id;
  const [user, setUser] = useState(
    props.state && props.state.user ? props.state.user : {}
  );
  const [contestDetail, setContestDetail] = useState({});
  const [effect, setEffect] = useState(true);

  useEffect(() => {
    getContestDetail();
    return (()=>{

    })
  }, [effect]);

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

  return (
    <>
      {contestDetail && (
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
                    <i className="fas fa-check" /> You must have a stable
                    internet connection. You will lose if you disconnect!.
                  </p>
                  {contestDetail.contest_rules && contestDetail.contest_rules.trim() && (
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
                      <WebHeader title={'Contest Detail'} history={props.history} arrow={true}/>
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
                            <button
                              className={`btn ${
                                contestDetail.status === 'active'
                                  ? 'activebtn'
                                  : 'inactivebtn'
                              }`}
                            >
                              {contestDetail.status === 'active'
                                ? 'Active'
                                : 'Inactive'}
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
                          <button className="btn">Join the contest</button>
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
    </>
  );
};

const mapStateToProps = function (state) {
  return {
    state: state,
  };
};

export default connect(mapStateToProps)(ContestDetail);
