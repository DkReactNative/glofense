import React, {useRef} from 'react';
import {connect, useDispatch} from 'react-redux';
import Countdown from './countDown';
import {Line} from 'rc-progress';
var player;
var interval10SecondsVid;
var interval10Seconds;
var Timer10Seconds = 10;
const QuestionList = ({
  question,
  loadResult,
  show5secondTimer,
  onChoose,
  counter,
  onFinish5second,
  ...props
}) => {
  const language = props.state.user.language;
  var answer = {
    question_id: question && question.id ? question.id : '',
    answer_key:
      language === 'english'
        ? question && question.answer_english
        : language === 'hindi'
        ? question && question.answer_hindi
        : '',
    user_answer_key: '',
    duration: 0 + '',
    result: 'missed',
  };
  const [currentTime, setDuration] = React.useState(0);
  const [checked, setChecked] = React.useState(-1);
  const [show5second, setShowOptions] = React.useState(show5secondTimer);
  const [playEnd, setPlayer] = React.useState(true);
  React.useEffect(() => {
    setShowOptions(
      question &&
        question.question_type &&
        (question.question_type === 'video' ||
          question.question_type === 'audio')
        ? false
        : show5secondTimer
    );
    setChecked(-1);
  }, [show5secondTimer, counter, loadResult, question]);

  React.useEffect(() => {
    const vid = document.getElementById(question && question.question_type);
    if (
      question &&
      question.question_type &&
      vid &&
      !playEnd &&
      (question.question_type === 'audio' || question.question_type === 'video')
    ) {
      vid.load();
      vid.play();
      vid.onloadedmetadata = function (e) {
        player = e.target;
        console.log(player.duration);
        const interval = setInterval(() => {
          setDuration(player.currentTime);
          //console.log(currentTime, player.currentTime);
          if (player.currentTime >= player.duration) {
            clearInterval(interval);
            setPlayer(true);
            console.log('on finish');
            onFinish5second(loadResult);
            if (show5secondTimer) {
              interval10SecondsVid = setInterval(() => {
                // console.log('Timer10Seconds vid =>', Timer10Seconds);
                Timer10Seconds = Timer10Seconds - 0.5;
                if (Timer10Seconds <= 0) {
                  clearInterval(interval10SecondsVid);
                  Timer10Seconds = 10;
                  onChoose(answer);
                  return;
                }
              }, 500);
            }
          }
        }, 1000);
      };
    }
  }, [playEnd]);

  React.useEffect(() => {
    Timer10Seconds = 10;
    clearInterval(interval10Seconds);
    clearInterval(interval10SecondsVid);
    if (
      question &&
      question.question_type &&
      (question.question_type === 'video' || question.question_type === 'audio')
    ) {
      setPlayer(!playEnd);
    }
  }, [question]);

  const onSelect = (option, index, selected) => {
    clearInterval(interval10Seconds);
    clearInterval(interval10SecondsVid);
    answer['question_id'] = question._id ? question._id : '';
    answer['answer_key'] = selected ? selected : '';
    answer['user_answer_key'] = option ? option : '';
    answer['duration'] = String(parseInt(Timer10Seconds))
      ? parseInt(Timer10Seconds)
      : 1;
    answer['result'] = option === selected ? 'right' : 'wrong';
    onChoose(answer);
    Timer10Seconds = 10;
    setChecked(index);
  };

  return (
    <div className="web-bg">
      <div className="download-app-right">
        <div className="questionsrightpart">
          <h3>
            {language && question && !loadResult
              ? language === 'english'
                ? question.question_english
                : language === 'hindi'
                ? question.question_hindi
                : ''
              : loadResult
              ? 'Please Wait Loading Results'
              : 'NA'}
          </h3>
          {question && !playEnd && question.question_type === 'audio' && (
            <>
              <audio
                ref={(ref) => (player = ref)}
                preload="metadata"
                autoPlay
                id="audio"
              >
                <source src={question.question_file}></source>
              </audio>
              <Line
                percent={player ? (currentTime / player.duration) * 100 : 100}
                strokeWidth="1"
                trailWidth="1"
                trailColor="#ccc"
                strokeColor="#fed613"
                style={{
                  width: '80%',
                  height: 10,
                  borderRadius: 5,
                  marginRight: 5,
                }}
              />
            </>
          )}
          {question && question.question_type === 'video' && (
            <video
              ref={(ref) => (player = ref)}
              preload="metadata"
              controlsList="nodownload noremoteplayback"
              autoPlay
              id="video"
            >
              <source src={question.question_file}></source>
            </video>
          )}
          {question && question.question_type === 'image' && (
            <img
              src={question.question_file}
              alt="Questionimage"
              style={{height: 300, width: 300, objectFit: 'contain'}}
            />
          )}

          {show5second && (
            <div className="waitingboard waitingboard-copy">
              <Countdown
                counter={loadResult ? 9 : counter}
                status={show5secondTimer}
                onFinish={() => {
                  console.log('on finish');
                  interval10Seconds = setInterval(() => {
                    // console.log('Timer10Seconds =>', Timer10Seconds);
                    Timer10Seconds = Timer10Seconds - 0.5;
                    if (Timer10Seconds <= 0) {
                      clearInterval(interval10Seconds);
                      Timer10Seconds = 10;
                      if (!loadResult) onChoose(answer);
                      return;
                    }
                  }, 500);
                  setShowOptions(false);
                  onFinish5second(loadResult);
                }}
              />
            </div>
          )}
          {playEnd && !show5second && (
            <div className="selectanswar" style={{marginTop: 20}}>
              {question && (
                <ul>
                  <li
                    className={`${checked === 0 ? 'active' : ''} `}
                    onClick={() => {
                      if (checked === -1) {
                        onSelect(
                          language === 'english'
                            ? 'first_option_english'
                            : language === 'hindi'
                            ? 'first_option_hindi'
                            : 'NA',
                          0,
                          language === 'english'
                            ? question.answer_english
                            : language === 'hindi'
                            ? question.answer_hindi
                            : 'NA'
                        );
                      }
                    }}
                  >
                    <span>
                      {language
                        ? language === 'english'
                          ? question.first_option_english
                          : language === 'hindi'
                          ? question.first_option_hindi
                          : 'NA'
                        : 'NA'}{' '}
                      <span className="custom_check">
                        &nbsp;
                        <input
                          type="checkbox"
                          checked={checked === 0}
                          disabled={checked > -1}
                          onChange={() => {
                            if (checked === -1) {
                              onSelect(
                                language === 'english'
                                  ? 'first_option_english'
                                  : language === 'hindi'
                                  ? 'first_option_hindi'
                                  : 'NA',
                                0,
                                language === 'english'
                                  ? question.answer_english
                                  : language === 'hindi'
                                  ? question.answer_hindi
                                  : 'NA'
                              );
                            }
                          }}
                        />
                        <span className="check_indicator">&nbsp;</span>
                      </span>
                    </span>
                  </li>
                  <li
                    className={`${checked === 1 ? 'active' : ''} `}
                    onClick={() => {
                      if (checked === -1) {
                        onSelect(
                          language === 'english'
                            ? 'first_option_english'
                            : language === 'hindi'
                            ? 'first_option_hindi'
                            : 'NA',
                          1,
                          language === 'english'
                            ? question.answer_english
                            : language === 'hindi'
                            ? question.answer_hindi
                            : 'NA'
                        );
                      }
                    }}
                  >
                    <span>
                      {language
                        ? language === 'english'
                          ? question.second_option_english
                          : language === 'hindi'
                          ? question.second_option_hindi
                          : 'NA'
                        : 'NA'}{' '}
                      <span className="custom_check">
                        &nbsp;
                        <input
                          type="checkbox"
                          checked={checked === 1}
                          disabled={checked > -1}
                          onChange={() => {
                            if (checked === -1) {
                              onSelect(
                                language === 'english'
                                  ? 'second_option_english'
                                  : language === 'hindi'
                                  ? 'second_option_hindi'
                                  : 'NA',
                                1,
                                language === 'english'
                                  ? question.answer_english
                                  : language === 'hindi'
                                  ? question.answer_hindi
                                  : 'NA'
                              );
                            }
                          }}
                        />
                        <span className="check_indicator">&nbsp;</span>
                      </span>
                    </span>
                  </li>
                  <li
                    className={`${checked === 2 ? 'active' : ''} `}
                    onClick={() => {
                      if (checked === -1) {
                        onSelect(
                          language === 'english'
                            ? 'third_option_english'
                            : language === 'hindi'
                            ? 'third_option_hindi'
                            : 'NA',
                          2,
                          language === 'english'
                            ? question.answer_english
                            : language === 'hindi'
                            ? question.answer_hindi
                            : 'NA'
                        );
                      }
                    }}
                  >
                    <span>
                      {language
                        ? language === 'english'
                          ? question.third_option_english
                          : language === 'hindi'
                          ? question.third_option_hindi
                          : 'NA'
                        : 'NA'}{' '}
                      <span className="custom_check">
                        &nbsp;
                        <input
                          type="checkbox"
                          checked={checked === 2}
                          disabled={checked > -1}
                          onChange={() => {
                            onSelect(
                              language === 'english'
                                ? 'third_option_english'
                                : language === 'hindi'
                                ? 'third_option_hindi'
                                : 'NA',
                              2,
                              language === 'english'
                                ? question.answer_english
                                : language === 'hindi'
                                ? question.answer_hindi
                                : 'NA'
                            );
                          }}
                        />
                        <span className="check_indicator">&nbsp;</span>
                      </span>
                    </span>
                  </li>
                  <li
                    className={`${checked === 3 ? 'active' : ''} `}
                    onClick={() => {
                      if (checked === -1) {
                        onSelect(
                          language === 'english'
                            ? 'fourth_option_english'
                            : language === 'hindi'
                            ? 'fourth_option_english'
                            : 'NA',
                          3,
                          language === 'english'
                            ? question.answer_english
                            : language === 'hindi'
                            ? question.answer_hindi
                            : 'NA'
                        );
                      }
                    }}
                  >
                    <span>
                      {language
                        ? language === 'english'
                          ? question.fourth_option_english
                          : language === 'hindi'
                          ? question.fourth_option_hindi
                          : 'NA'
                        : 'NA'}{' '}
                      <span className="custom_check">
                        &nbsp;
                        <input
                          type="checkbox"
                          checked={checked === 3}
                          disabled={checked > -1}
                          onChange={() => {
                            onSelect(
                              language === 'english'
                                ? 'fourth_option_english'
                                : language === 'hindi'
                                ? 'fourth_option_hindi'
                                : 'NA',
                              3,
                              language === 'english'
                                ? question.answer_english
                                : language === 'hindi'
                                ? question.answer_hindi
                                : 'NA'
                            );
                          }}
                        />
                        <span className="check_indicator">&nbsp;</span>
                      </span>
                    </span>
                  </li>
                </ul>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
const mapStateToProps = function (state) {
  return {
    state: state,
  };
};

export default connect(mapStateToProps)(QuestionList);
