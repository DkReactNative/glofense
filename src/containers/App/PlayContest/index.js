import {connect, useDispatch} from 'react-redux';
import React, {useEffect, useContext, useState} from 'react';
import {Link, Redirect} from 'react-router-dom';
import QuestionList from '../../../components/questionList';
import Session from '../../../helpers/session';
import WebHeader from '../../../components/web-header';
import {
  showToast,
  showDangerToast,
  showInfoToast,
} from '../../../components/toastMessage';
import {getService} from '../../../services/getService';
import {postService} from '../../../services/postService';
import WaitingUser from '../../../components/waitingOpponent';
import QuestionResponseTimer from '../../../components/questionResponseTimer';
import SocketContext from '../../../constants/socket-context';
import * as $ from 'jquery';
var answerData;
var totalRight = 0;
var totalWrong = 0;
var matchId;
const PlayContest = (props) => {
  const socket = useContext(SocketContext);
  const [user, setUser] = useState(
    props.state && props.state.user ? props.state.user : {}
  );
  if (props.state.browserReload) {
    showDangerToast('Refreshing page not allowed');
    endGame();
    props.history.replace('/user');
  }
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
  const contestId = props.match.params.id;
  const dispatch = useDispatch();

  const [contestDetail, SetContestDetail] = useState({});
  const [effect, setEffect] = useState(true);
  const [UserPoints, setUserPoints] = useState(0);
  const [questionsData, setQuestionsData] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userMatch, setUsermatch] = useState(false);
  const [show5secondTimer, set5secondTimer] = useState(false);
  const [show10SecondTimer, set10SecondTimer] = useState(false);

  useEffect(() => {
    if (!props.state.gameId || !props.state.gameId.gameId) {
      showDangerToast(
        'Something went wrong. Game detail is not found. Please try again'
      );
      props.history.replace('/user/my-contest');
      return;
    }
    matchId = props.state.gameId.gameId;
    getContestDetail();
    loadContestQuestion();
    return () => {
      console.log('I am destroyed');
      endGame();
      if (true) {
        window.removeEventListener('beforeunload', () => {});
        window.removeEventListener('blur', () => {});
        document.removeEventListener('fullscreenchange', () => {});
        document.removeEventListener('mozfullscreenchange', () => {});
        document.removeEventListener('MSFullscreenChange', () => {});
        document.removeEventListener('webkitfullscreenchange', () => {});
        document
          .getElementById('fullscreen')
          .removeEventListener('click', () => {});
        window.removeEventListener('onstatepop', () => {});
      }
    };
  }, [effect]);

  const loadContestQuestion = () => {
    postService(`contest-questions`, JSON.stringify({contest_id: contestId}))
      .then((response) => {
        response = response['data'];
        if (response.success) {
          showToast(response.msg);
          response = response.results;
          domEventHandler();
          setQuestionsData(response);
          setUsermatch(true);
          set5secondTimer(true);
          socket.emit('startContestGame', {
            match_id: matchId,
            user_id: user._id,
          });
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
      .catch((err) => {});
  };

  const getContestDetail = () => {
    getService(`${'get-contest'}/${contestId}`)
      .then((response) => {
        response = response['data'];
        if (response.success) {
          SetContestDetail(response.results);
        }
      })
      .catch((err) => {});
  };

  function endGame() {
    socket.emit('endContestGame', {match_id: matchId, user_id: user._id});
  }

  const onChoose = (answer) => {
    answerData = answer;
    if (answer.result === 'right') {
      totalRight += 1;
      setUserPoints(UserPoints + answer.duration);
    } else if (answer.result === 'wrong') {
      totalWrong += 1;
    }
    let socketRequest = {
      Points: UserPoints + '',
      matchId: matchId,
      user_id: user._id,
      questionData: answer,
      TotalRightAnswer: totalRight + '',
      TotalWrongAnswer: totalWrong + '',
    };
    console.log(JSON.stringify(socketRequest));
    socket.emit('RunningContest', socketRequest);

    if (questionsData.length === currentQuestion + 1) {
      console.log('currentQuestion', currentQuestion);
      endGame();
    }
  };

  // Dom all handlers
  function exitHandler(e) {
    if (
      document.webkitIsFullScreen ||
      document.mozFullScreen ||
      document.msFullscreenElement !== null
    ) {
      showInfoToast("Please don't exit full screen");
      document.body.requestFullscreen().catch((err) => {});
      mKeyF11();
      $('#fullscreen').trigger('click');
    }
  }

  function mKeyF11() {
    var e = new Event('keypress');
    e.which = 122; // Character F11 equivalent.
    e.altKey = false;
    e.ctrlKey = false;
    e.shiftKey = false;
    e.metaKey = false;
    $('#fullscreen').trigger('click');
    // e.bubbles = true;
    document.dispatchEvent(e);
  }

  const domEventHandler = () => {
    document.addEventListener('fullscreenchange', exitHandler, false);
    document.addEventListener('mozfullscreenchange', exitHandler, false);
    document.addEventListener('MSFullscreenChange', exitHandler, false);
    document.addEventListener('webkitfullscreenchange', exitHandler, false);

    document
      .getElementById('fullscreen')
      .addEventListener('click', function () {
        toggleFullscreen(this);
      });

    window.addEventListener('beforeunload', function (e) {
      e.preventDefault();
      e.returnValue = '';
    });

    window.addEventListener('blur', function (e) {
      showInfoToast("Please don't leave page for continuos play the game");
    });

    window.addEventListener('onstatepop', (e) => {
      console.log(e);
      e.preventDefault();
    });

    try {
      if (!document.requestFullscreen) {
        document.body.requestFullscreen().catch((err) => {});
      } else {
        document.body.exitFullscreen();
      }
    } catch (error) {
      console.log(error);
    }
  };

  function toggleFullscreen(elem) {
    fullScreen(elem);
    elem = elem || document.documentElement;

    if (!document.fullscreenElement) {
      if (elem.requestFullscreen) {
        document.body.requestFullscreen().catch((err) => {});
      }
    }
  }

  function fullScreen(elem) {
    var el = elem || document.documentElement;
    var rfs =
      el.requestFullScreen ||
      el.webkitRequestFullScreen ||
      el.mozRequestFullScreen ||
      el.msRequestFullScreen;
    if (rfs && typeof rfs != 'undefined' && el) {
      try {
        rfs.call(el).catch((err) => {
          console.log(err);
        });
      } catch {}
    } else if (typeof window.ActiveXObject != 'undefined') {
      var wscript = new window.ActiveXObject('WScript.Shell');
      if (wscript != null) {
        wscript.SendKeys('{F11}');
      }
    }
  }
  // handlers end

  return (
    <section className="body-inner-P">
      <div className="web-container">
        {userMatch ? (
          <QuestionList
            question={
              questionsData.length > 0 && questionsData[currentQuestion]
                ? questionsData[currentQuestion]
                : null
            }
            onChoose={(answer) => {
              onChoose(answer);
            }}
            onFinish5second={(status) => {
              if (status) {
                let obj = {
                  right_answers: totalRight,
                  wrong_answers: totalWrong,
                  points: UserPoints,
                };
                document
                  .getElementById('fullscreen')
                  .removeEventListener('click', () => {});
                sessionStorage.setItem('matchDetail', JSON.stringify(obj));
                props.history.replace('/user/contest-end/' + matchId);
              }
              set5secondTimer(status ? true : false);
              set10SecondTimer(status ? false : true);
            }}
            loadResult={questionsData.length === currentQuestion}
            counter={5}
            show5secondTimer={show5secondTimer}
          />
        ) : (
          <WaitingUser
            counter={29}
            status={userMatch}
            onFinish={() => {
              console.log('on finished');
              setUsermatch(true);
              set5secondTimer(true);
            }}
          />
        )}
        <div className="web-left-container bgCurve">
          <div className="pageheaderouter">
            <div className="tab-pane active" id="profile" role="tabpanel">
              <div className="header_height">
                <WebHeader title={'Contest and Quiz'} disableClick={true} />
                <div className="questionanswarstatus">
                  <QuestionResponseTimer
                    counter={10}
                    onFinish10SecondTimer={() => {
                      console.log('onFinish10SecondTimer');
                      set5secondTimer(true);
                      set10SecondTimer(false);
                      setCurrentQuestion(currentQuestion + 1);
                    }}
                    status={show10SecondTimer}
                  />
                  <div className="quizpatner">
                    <div className="userone user-contest">
                      <div className="userimg">
                        <img
                          src={user.image}
                          alt="#"
                          className="contest-user-img"
                        />
                      </div>
                      <Link to="#">
                        <h5>{user.username ? user.username : 'NA'}</h5>
                      </Link>
                      <span className="points">
                        <i className="fas fa-star" />{' '}
                        {UserPoints ? UserPoints : 0} Pts.
                      </span>
                    </div>
                  </div>
                  <div className="questionsflex d-flex mb-4">
                    {questionsData && questionsData.length > 0 && (
                      <div className="question">
                        Q.{' '}
                        {questionsData.length === currentQuestion
                          ? currentQuestion
                          : currentQuestion + 1}
                        /{questionsData.length}
                      </div>
                    )}
                    {/* <div className="selectlenguge">
                      <span>Eng.</span>
                      <span>
                        <span className="switch">
                          <input type="checkbox" />
                          <span className="slider">&nbsp;</span>
                        </span>
                      </span>
                      <span>Hin.</span>
                    </div> */}
                  </div>
                </div>
              </div>
            </div>
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

export default connect(mapStateToProps)(PlayContest);
