import React from 'react';
import {connect, useDispatch} from 'react-redux';
import Countdown from './countDown';
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
  const [answer, setAnswer] = React.useState(null);
  const [checked, setChecked] = React.useState(-1);
  const [show5second, setShowOptions] = React.useState(show5secondTimer);

  React.useEffect(() => {
    setShowOptions(show5secondTimer);
    setChecked(-1);
  }, [show5secondTimer, counter, loadResult, question]);

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
                : 'NA'
              : loadResult
              ? 'Please Wait Loading Results'
              : 'NA'}
          </h3>
          {show5second ? (
            <div className="waitingboard waitingboard-copy">
              <Countdown
                counter={loadResult ? 10 : counter}
                status={show5secondTimer}
                onFinish={() => {
                  console.log('on finish');
                  setShowOptions(true);
                  onFinish5second(loadResult);
                }}
              />
            </div>
          ) : (
            <div className="selectanswar">
              {question && (
                <ul>
                  <li
                    className={`${checked === 0 ? 'active' : ''} `}
                    onClick={() => {
                      if (checked === -1) setChecked(0);
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
                            if (checked === -1) setChecked(0);
                          }}
                        />
                        <span className="check_indicator">&nbsp;</span>
                      </span>
                    </span>
                  </li>
                  <li
                    className={`${checked === 1 ? 'active' : ''} `}
                    onClick={() => {
                      if (checked === -1) setChecked(1);
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
                            if (checked === -1) setChecked(1);
                          }}
                        />
                        <span className="check_indicator">&nbsp;</span>
                      </span>
                    </span>
                  </li>
                  <li
                    className={`${checked === 2 ? 'active' : ''} `}
                    onClick={() => {
                      if (checked === -1) setChecked(2);
                    }}
                  >
                    <span>
                      {language
                        ? language === 'english'
                          ? question.third_option_english
                          : language === 'hindi'
                          ? question.third_option_english
                          : 'NA'
                        : 'NA'}{' '}
                      <span className="custom_check">
                        &nbsp;
                        <input
                          type="checkbox"
                          checked={checked === 2}
                          disabled={checked > -1}
                          onChange={() => {
                            setChecked(2);
                          }}
                        />
                        <span className="check_indicator">&nbsp;</span>
                      </span>
                    </span>
                  </li>
                  <li
                    className={`${checked === 3 ? 'active' : ''} `}
                    onClick={() => {
                      if (checked === -1) setChecked(3);
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
                            setChecked(3);
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
