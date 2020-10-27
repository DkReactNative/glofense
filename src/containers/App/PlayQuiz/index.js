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
const PlayQuiz = (props) => {
  var FromInvite = false;
  var inviteCode = Session.getSession('inViteCode')
    ? Session.getSession('inViteCode').invite_code
    : null;

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
  var quizID = props.match.params.id;
  quizID = quizID.split(':');
  if (quizID.length === 1) {
    quizID = quizID[0];
  } else if (quizID[0] === 'FromInvite') {
    FromInvite = true;
    quizID = quizID[1];
  } else {
    endGame();
    showDangerToast('Changing URL of Website are permitted');
    props.history.replace('/user');
  }
  if (!inviteCode && FromInvite) {
    showDangerToast('Sorry Invite code detail lost. Please try again');
    props.history.replace('/user');
  }
  const dispatch = useDispatch();
  const [quizDetail, SetQuizDetail] = useState({});
  const [effect, setEffect] = useState(true);
  const [otherUser, setOtherUser] = useState(null);
  const [otherUserPoints, setOtherUserPoints] = useState(0);
  const [UserPoints, setUserPoints] = useState(0);
  const [questionsData, setQuestionsData] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userMatch, setUsermatch] = useState(false);
  const [show5secondTimer, set5secondTimer] = useState(false);
  const [show10SecondTimer, set10SecondTimer] = useState(false);
  const [inviteMatchDetail, setInviteMatchDetail] = useState(
    props.state.inviteMatchDetail
  );
  useEffect(() => {
    console.log('inviteMatchDetail => ', props.state.inviteMatchDetail);
    getQuizDetail();

    if (!FromInvite) {
      SearchOnlineUser();
    } else {
      QuestionsApi();
      setInviteMatchDetail(props.state.inviteMatchDetail);
    }

    return () => {
      console.log('I am destroyed');
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

  const SearchOnlineUser = () => {
    postService(`online-user-search`, JSON.stringify({quiz_id: quizID}))
      .then((response) => {
        response = response['data'];
        if (response.success) {
          showToast(response.msg);
          response = response.results;
          domEventHandler();
          setQuestionsData(response.questions);
          setOtherUser(response.opponent);
          setUsermatch(true);
          addMatchHandlers(response.opponent);
          set5secondTimer(true);
          matchId = response.match_id;
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

  const QuestionsApi = () => {
    postService(
      `invite-user-question`,
      JSON.stringify({match_id: inviteMatchDetail.match_id})
    )
      .then((response) => {
        response = response['data'];
        console.log('invite-user-question =>', response);
        if (response.success) {
          showToast(response.msg);
          response = response.results;
          domEventHandler();
          setQuestionsData(response.questions);
          if (user._id === response.opponent._id) {
            setOtherUser(response.user);
            addMatchHandlers(response.user);
          } else {
            setOtherUser(response.opponent);
            addMatchHandlers(response.opponent);
          }
          setUsermatch(true);
          set5secondTimer(true);
          matchId = response.match_id;
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

  const addMatchHandlers = (opponent) => {
    let tempID = `RunningGame_${opponent.id}`;
    console.log('tempID', tempID, opponent);
    socket.on(tempID, (data) => {
      console.log('RunningGame_data--->', data);
      if (data) {
        setOtherUserPoints(data['Points'] ? data['Points'] : otherUserPoints);
      }
    });
  };

  const getQuizDetail = () => {
    getService(`${'get-quiz'}/${quizID}`)
      .then((response) => {
        response = response['data'];

        if (response.success) {
          // if (
          //   quizDetail.quiz_language === 'english' ||
          //   quizDetail.quiz_language === 'hindi'
          // ) {
          //   dispatch({
          //     type: 'update_profile',
          //     payload: {language: quizDetail.quiz_language},
          //   });
          // }
          SetQuizDetail(response.results);
        }
      })
      .catch((err) => {});
  };

  function endGame() {
    if (FromInvite) {
      socket.emit('removeInviteCode', {
        user_id: user._id,
        invite_code: inviteCode,
        quiz_id: quizID,
      });
    } else {
      socket.emit(
        'endGame',
        JSON.stringify({match_id: matchId, user_id: user._id})
      );
    }
  }

  const onChoose = (answer) => {
    answerData = answer;
    let points = UserPoints;
    if (answer.result === 'right') {
      totalRight += 1;
      points = UserPoints + answer.duration;
      setUserPoints(UserPoints + answer.duration);
    } else if (answer.result === 'wrong') {
      totalWrong += 1;
    }
    let socketRequest = {
      Points: points + '',
      ListnerKey: `RunningGame_${user._id}`,
      matchId: matchId,
      user_id: user._id,
      questionData: answer,
      TotalRightAnswer: totalRight + '',
      TotalWrongAnswer: totalWrong + '',
    };
    console.log(JSON.stringify(socketRequest));
    socket.emit('RunningGame', socketRequest);
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
                };
                document
                  .getElementById('fullscreen')
                  .removeEventListener('click', () => {});
                sessionStorage.setItem('matchDetail', JSON.stringify(obj));
                props.history.replace('/user/match-end/' + matchId);
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
                    <div className="userone">
                      <div className="userimg">
                        <img src={user.image} alt="#" />
                      </div>
                      <Link to="#">
                        <h5>{user.username ? user.username : 'NA'}</h5>
                      </Link>
                      <span className="points">
                        <i className="fas fa-star" />{' '}
                        {UserPoints ? UserPoints : 0} Pts.
                      </span>
                    </div>
                    <div className="vsteam">vs</div>
                    <div className="userone">
                      <div className="userimg">
                        <img src={otherUser ? otherUser.image : ''} alt="#" />
                      </div>
                      <Link to="#">
                        <h5>
                          {otherUser
                            ? otherUser.username
                              ? otherUser.username
                              : 'NA'
                            : 'Waiting'}
                        </h5>
                      </Link>
                      <span className="points">
                        <i className="fas fa-star" />{' '}
                        {otherUserPoints ? otherUserPoints : 0} Pts.
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

export default connect(mapStateToProps)(PlayQuiz);
