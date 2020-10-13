import {connect} from 'react-redux';
import React, {useEffect, useState} from 'react';
import {Link, Redirect} from 'react-router-dom';
import WebHeader from '../../../components/web-header';
import {getService} from '../../../services/getService';
import Buttom from '../../../components/buttomTabBar';
import {formateDate} from '../../../helpers/commonHelpers';
const QuizDetail = (props) => {
  const quizId = props.match.params.id;
  const [user, setUser] = useState(
    props.state && props.state.user ? props.state.user : {}
  );
  const [quizDetail, setQuizDetail] = useState({});
  const [effect, setEffect] = useState(true);

  useEffect(() => {
    getQuizDetail();
  }, [effect]);

  const getQuizDetail = () => {
    getService(`get-quiz/${quizId}`)
      .then((response) => {
        response = response['data'];
        if (response.success) setQuizDetail(response.results);
      })
      .catch((err) => {});
  };

  return (
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
                            <h4>{quizDetail.name ? quizDetail.name : 'NA'}</h4>
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
                          props.history.push('/user/choose-language/quiz:' + quizId);
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
  );
};

const mapStateToProps = function (state) {
  return {
    state: state,
  };
};

export default connect(mapStateToProps)(QuizDetail);
