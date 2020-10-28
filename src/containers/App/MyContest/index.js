import {connect, useDispatch} from 'react-redux';
import React, {useEffect, useState} from 'react';
import {Link, Redirect} from 'react-router-dom';
import WebBg from '../../../components/web-bg';
import {getService} from '../../../services/getService';
import Buttom from '../../../components/buttomTabBar';
import WebHeader from '../../../components/web-header';
import Timer from '../../../components/timer';
import {Line} from 'rc-progress';
import Session from '../../../helpers/session';
import {showInfoToast} from '../../../components/toastMessage';
const MyContest = (props) => {
  const dispatch = useDispatch();
  const [effect, setEffect] = useState(true);
  const [upcomingList, setupcomingList] = useState([]);
  const [livetList, setlivetList] = useState([]);
  const [completedList, setcompletedList] = useState([]);
  var currentPage = 0;

  useEffect(() => {
    console.log("called")
    document.body.style.overflow = 'hidden';
    getContestList(1, 'upcoming');
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [effect]);

  const returnSeconds = (startDate, endDate) => {
    var date1 = new Date(startDate);
    var date2 = new Date();
    var diff = (date1 - date2) / 1000;
    return diff;
  };

  const getContestList = (page = currentPage + 1, type) => {
    currentPage = page;
    getService(
      `upcoming-contest?page=${page}&itemsPerPage=100&match_status=${type}`
    )
      .then((response) => {
        response = response['data'];
        let array = [];
        array = response['results']['docs'].map((ele) => {
          if (
            ele.game_id &&
            ele.game_id.category_id &&
            ele.game_id.category_id.image
          ) {
            ele.image = ele.game_id.category_id.image;
          }
          ele.category_id = ele.game_id.category_id._id;
          ele.category_title = ele.game_id.category_id.title;
          ele.counter = returnSeconds(ele.start_date);
          return ele;
        });
        setupcomingList([]);
        setlivetList([]);
        setcompletedList([]);
        if (type === 'upcoming') {
          setupcomingList(array);
        } else if (type === 'running') {
          setlivetList(array);
        } else if (type === 'completed') {
          setcompletedList(array);
        }
      })
      .catch((err) => {});
  };

  const renderList = (ele, index, type) => {
    return (
      <div
        className="quizboxouter"
        key={index + '2'}
        onClick={() => {
          if (type === 'running' || type === 'completed') {
            if (ele.status === 'under_review') {
              showInfoToast('Contest is under review please wait for results');
            } else {
              localStorage.setItem(
                'game_id',
                JSON.stringify({
                  ...ele.game_id,
                  ...{gameId: ele.id},
                })
              );
              dispatch({
                type: 'update_game_id',
                payload: {...ele.game_id, ...{gameId: ele.id}},
              });
              props.history.push(
                '/user/my-contest/contest-detail/' + ele.game_id._id
              );
            }
          }
        }}
      >
        <div className="quizdetails">
          <div className="quizimg">
            <Link to="#">
              <img src={ele.image} className="img-fluid" alt="#" />
            </Link>
          </div>
          <div className="quizcontent">
            <Link to="#">
              <h4>{ele.game_id.name ? ele.game_id.name : 'NA'}</h4>
            </Link>
            <p className="mb-0">
              {ele.game_id.description ? ele.game_id.description : 'NA'}
            </p>
          </div>
        </div>
        <div className="quizamounts">
          <div className="text-center">
            <p>Total Questions</p>
            <span>
              {' '}
              {ele.game_id.questions_count ? ele.game_id.questions_count : 'NA'}
            </span>
          </div>
          <div className="text-center">
            <p>Winning Amount</p>
            <span>
              {ele.game_id.winning_amount ? ele.game_id.winning_amount : 0} ₹
            </span>
          </div>
          <div className="text-center">
            <p>Entry Fee</p>
            <span>
              {ele.game_id.quiz_type && ele.game_id.quiz_type === 'free'
                ? 'free'
                : `${ele.game_id.entry_fee ? ele.game_id.entry_fee : 0} ₹`}
            </span>
          </div>
        </div>
        <div className="statusouter">
          <Line
            percent={
              (ele.game_id.joined_user_count / ele.game_id.users_limit) * 100
            }
            strokeWidth="1"
            trailWidth="1"
            trailColor="#ccc"
            strokeColor="#b40901"
            style={{
              width: '100%',
              height: 10,
              borderRadius: 5,
              marginRight: 5,
            }}
          />

          <div className="timerset text-center">
            <span>
              <i className="fas fa-clock" />
              {ele.status === 'under_review' ? (
                'Under Review'
              ) : ele.counter > 2 ? (
                <Timer
                  counter={ele.counter}
                  onFinish={() => {
                    getContestList(1, type);
                  }}
                />
              ) : type === 'completed' ? (
                'Completed'
              ) : (
                'Live'
              )}
            </span>
          </div>
        </div>
      </div>
    );
  };

  window.onpopstate = function (event) {
    if (event) {
      return <Redirect to="/user" />;
    } else {
      // Continue user action through link or button
    }
  };

  return (
    <section className="body-inner-P">
      <div className="web-container">
        <WebBg />
        <div className="tab-pane active" id="messages" role="tabpanel">
          <div className="header_height pb-5">
            <WebHeader title={'MY CONTEST'} />
          </div>
          <div className="contestlisting">
            <div className="list-group" id="myList" role="tablist">
              <a
                className="list-group-item list-group-item-action active"
                data-toggle="list"
                href="#upcoming"
                role="tab"
                onClick={() => {
                  getContestList(1, 'upcoming');
                }}
              >
                Upcoming
              </a>
              <a
                className="list-group-item list-group-item-action"
                data-toggle="list"
                href="#live"
                role="tab"
                onClick={() => {
                  getContestList(1, 'running');
                }}
              >
                Live
              </a>
              <a
                className="list-group-item list-group-item-action"
                data-toggle="list"
                href="#completed"
                role="tab"
                onClick={() => {
                  getContestList(1, 'completed');
                }}
              >
                Completed
              </a>
            </div>
            <div className="tab-content">
              <div className="tab-pane active" id="upcoming" role="tabpanel">
                <div className="upcominglist">
                  {upcomingList.map((ele, index) => {
                    return renderList(ele, index, 'upcoming');
                  })}
                  {upcomingList.length === 0 && (
                    <div className="joincontest">
                      <div>
                        <Link to="/user">
                          <img
                            src={require('../../../assets/img/logo.png')}
                            alt="#"
                          />
                        </Link>
                        <p>No contest found </p>
                        <button
                          className="btn"
                          onClick={() => props.history.push('/user')}
                        >
                          Join Contest
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="tab-pane" id="live" role="tabpanel">
                <div className="upcominglist">
                  {livetList.map((ele, index) => {
                    return renderList(ele, index, 'running');
                  })}
                  {livetList.length === 0 && (
                    <div className="joincontest">
                      <div>
                        <Link to="#">
                          <img
                            src={require('../../../assets/img/logo.png')}
                            alt="#"
                          />
                        </Link>
                        <p>No contest found </p>
                        <button
                          className="btn"
                          onClick={() => props.history.push('/user')}
                        >
                          Join Contest
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="tab-pane" id="completed" role="tabpanel">
                <div className="upcominglist">
                  {completedList.map((ele, index) => {
                    return renderList(ele, index, 'completed');
                  })}
                  {completedList.length === 0 && (
                    <div className="joincontest">
                      <div>
                        <Link to="#">
                          <img
                            src={require('../../../assets/img/logo.png')}
                            alt="#"
                          />
                        </Link>
                        <p>No contest found </p>
                        <button
                          className="btn"
                          onClick={() => props.history.push('/user')}
                        >
                          Join Contest
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <Buttom active={'my-contest'} />
      </div>
    </section>
  );
};

const mapStateToProps = function (state) {
  return {
    state: state,
  };
};

export default connect(mapStateToProps)(MyContest);
