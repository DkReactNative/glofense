import React from 'react';
import Countdown from './countDown';
const QuestionList = ({
  question,
  options,
  show5secondTimer,
  onChoose,
  counter,
  onFinish5second,
}) => {
  const [answer, setAnswer] = React.useState(null);
  const [checked, setChecked] = React.useState(-1);
  const [show5second, setShowOptions] = React.useState(show5secondTimer);
  React.useEffect(() => {
    setShowOptions(show5secondTimer);
    setChecked(-1);
  }, [show5secondTimer, counter]);
  return (
    <div className="web-bg">
      <div className="download-app-right">
        <div className="questionsrightpart">
          <h3>
            What attraction in Montreal Is one of the largest in the world?
          </h3>
          {show5second ? (
            <div className="waitingboard waitingboard-copy">
              <Countdown
                counter={counter}
                status={show5secondTimer}
                onFinish={() => {
                  console.log('on finish');
                  setShowOptions(true);
                  onFinish5second();
                }}
              />
            </div>
          ) : (
            <div className="selectanswar">
              <ul>
                <li
                  className={`${checked === 0 ? 'active' : ''} `}
                  onClick={() => {
                    if (checked === -1) setChecked(0);
                  }}
                >
                  <span>
                    The Botanical Gardens{' '}
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
                    The Botanical Gardens{' '}
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
                    The Botanical Gardens{' '}
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
                    The Botanical Gardens{' '}
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
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuestionList;
