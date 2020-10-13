import React from 'react';
const QuestionList = ({question, options, loading,onChoose}) => {
 const[answer, setAnswer] = React.useState(null);
  return (
    <div className="web-bg">
      <div className="download-app-right">
        <div className="questionsrightpart">
          <h3>
            What attraction in Montreal Is one of the largest in the world?
          </h3>
          <div className="selectanswar">
            <ul>
              <li>
                <span>
                  The Botanical Gardens{' '}
                  <span className="custom_check">
                    &nbsp;
                    <input type="checkbox" />
                    <span className="check_indicator">&nbsp;</span>
                  </span>
                </span>
              </li>
              <li>
                <span>
                  The Botanical Gardens{' '}
                  <span className="custom_check">
                    &nbsp;
                    <input type="checkbox" />
                    <span className="check_indicator">&nbsp;</span>
                  </span>
                </span>
              </li>
              <li className="active">
                <span>
                  The Botanical Gardens{' '}
                  <span className="custom_check">
                    &nbsp;
                    <input type="checkbox" defaultChecked />
                    <span className="check_indicator">&nbsp;</span>
                  </span>
                </span>
              </li>
              <li>
                <span>
                  The Botanical Gardens{' '}
                  <span className="custom_check">
                    &nbsp;
                    <input type="checkbox" />
                    <span className="check_indicator">&nbsp;</span>
                  </span>
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionList
