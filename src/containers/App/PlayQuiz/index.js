import {connect, useDispatch} from 'react-redux';
import React, {useEffect, useState} from 'react';
import {Link, Redirect} from 'react-router-dom';
import Modal from 'react-bootstrap/Modal';
import QuestionList from '../../../components/questionList';
import Buttom from '../../../components/buttomTabBar';
import WebHeader from '../../../components/web-header';
import {getService} from '../../../services/getService';
const PlayQuiz = (props) => {
  const params = props.match.params.id.split(':');
  const dispatch = useDispatch();
  const [user, setUser] = useState(
    props.state && props.state.user ? props.state.user : {}
  );
  const [quizDetail, SetQuizDetail] = useState({});
  const [effect, setEffect] = useState(true);
  const [otherUser , setOtherUser] = useState({})
  const [questionsData , setQuestionsData] = useState([])

  useEffect(() => {
    getQuizDetail();
  }, [effect]);

  const getQuizDetail = () => {
    getService(
      `${
        params[0] === 'quiz'
          ? 'get-quiz'
          : params[0] === 'contest'
          ? 'get-contest'
          : ''
      }/${params[1]}`
    )
      .then((response) => {
        response = response['data'];

        if (response.success) {
          if (
            quizDetail.quiz_language === 'english' ||
            quizDetail.quiz_language === 'hindi'
          ) {
            dispatch({
              type: 'update_profile',
              payload: {language: quizDetail.quiz_language},
            });
          }
          SetQuizDetail(response.results);
        }
      })
      .catch((err) => {});
  };

  return (
    <section className="body-inner-P">
      <div className="web-container">
        <QuestionList />
        <div className="web-left-container bgCurve">
          <div className="pageheaderouter">
            <div className="tab-pane active" id="profile" role="tabpanel">
              <div className="header_height">
                <WebHeader title={'Contest and Quiz'} />
                <div className="questionanswarstatus">
                  <div className="statusouter">
                    <div className="d-flex mt-3">
                      <div className="bar-three bar-con">
                        <div className="bar" data-percent={70} />
                      </div>
                      <span className="watchtimer">
                        <i className="fas fa-clock" />
                      </span>
                    </div>
                    <div className="d-flex align-items-center">
                      <span>8 Second</span>
                    </div>
                  </div>
                  <div className="quizpatner">
                    <div className="userone">
                      <div className="userimg">
                        <img src="img/header_profile.png" alt="#" />
                      </div>
                      <a href="#">
                        <h5>Stive</h5>
                      </a>
                      <span className="points">
                        <i className="fas fa-star" /> 456 Pts.
                      </span>
                    </div>
                    <div className="vsteam">vs</div>
                    <div className="userone">
                      <div className="userimg">
                        <img src="img/header_profile.png" alt="#" />
                      </div>
                      <a href="#">
                        <h5>Stive</h5>
                      </a>
                      <span className="points">
                        <i className="fas fa-star" /> 456 Pts.
                      </span>
                    </div>
                  </div>
                  <div className="questionsflex d-flex mb-4">
                    <div className="question">Q. 1/10</div>
                    <div className="selectlenguge">
                      <span>Eng.</span>
                      <span>
                        <span className="switch">
                          <input type="checkbox" />
                          <span className="slider">&nbsp;</span>
                        </span>
                      </span>
                      <span>Hin.</span>
                    </div>
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