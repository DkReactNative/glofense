import {connect} from 'react-redux';
import React, {useEffect, useState} from 'react';
import {Link,Redirect} from 'react-router-dom';
import WebBg from '../../../components/web-bg';
import {getService} from '../../../services/getService';
import Buttom from '../../../components/buttomTabBar';
import WebHeader from '../../../components/web-header';
const Contest = (props) => {
 
  const categoryId = props.match.params.id;
  const [toggle, setToggle] = useState('headtohead');
  const [quizList, setQuizList] = useState([]);
  const [effect, setEffect] = useState(true);
  const [contestList, setcontestList] = useState([]);
  var currentPage = 0;

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    getQuizList();
    return (()=>{
      document.body.style.overflow = 'auto';
    })
  }, [effect]);

  const handleToggle = (toggle) => {
    setToggle(toggle);
    if (toggle === 'headtohead') {
      getQuizList(1);
    } else if (toggle === 'contest') {
      getContestList(1);
    }
  };

  const getContestList = (page = currentPage + 1) => {
    currentPage = page;
    getService(
      `get-contests?page=${page}&itemsPerPage=100&quizCat=${categoryId}`
    )
      .then((response) => {
        response = response['data'];
        // setCurrentPage(page)
        let array = [...contestList];
        array = response['results']['docs'].map((ele) => {
          ele.image = ele.category_id.image;
          ele.category_id = ele.category_id._id;
          ele.category_title = ele.category_id.title;
          return ele;
        });

        setcontestList(array);
      })
      .catch((err) => {});
  };

  const getQuizList = (page = currentPage + 1) => {
    currentPage = page;
    getService(
      `get-quizzes?page=${page}&itemsPerPage=100&quizCat=${categoryId}`
    )
      .then((response) => {
        response = response['data'];
        let array = [...quizList];
        array = response['results']['docs'].map((ele) => {
          if (ele.category_id && ele.category_id.image) {
            ele.image = response.image_path + ele.category_id.image;
          }
          ele.category_id = ele.category_id._id;
          ele.category_title = ele.category_id.title;
          return ele;
        });

        setQuizList(array);
      })
      .catch((err) => {});
  };

  window.onpopstate = function(event) {
    if(event){
      return <Redirect to='/user' />
    }
    else{
      // Continue user action through link or button
    }
  }

  return (
    <section className="body-inner-P">
      <div className="web-container">
        <WebBg />
        <div className="header_height pb-5">
          <WebHeader title={"Contest and Quiz"} />
        </div>
        <div className="contestquiz">
          <div className="quiztab">
            <div className="list-group" id="myList2" role="tablist">
              <Link
                className={`list-group-item list-group-item-action ${
                  toggle === 'headtohead' ? 'active' : ''
                }`}
                data-toggle="list"
                to="#"
                role="tab"
                onClick={() => {
                  handleToggle('headtohead');
                }}
              >
                Head to Head
              </Link>
              <Link
                className={`list-group-item list-group-item-action ${
                  toggle === 'contest' ? 'active' : ''
                }`}
                data-toggle="list"
                to="#"
                role="tab"
                onClick={() => {
                  handleToggle('contest');
                }}
              >
                Contest
              </Link>
            </div>

            <div className="tab-content pl-3 pr-3">
              {/* contest view */}
              <div
                className={`tab-pane ${
                  toggle === 'headtohead' ? 'active' : ''
                }`}
                id="headtohead"
                role="tabpanel"
              >
                {quizList.map((ele, index) => {
                  return (
                    <div className="quizboxouter" onClick={()=>{
                      props.history.push("/user/quiz-detail/"+ele._id)
                    }}>
                      <div className="quizdetails">
                        <div className="quizimg">
                          <Link to="#">
                            <img
                              src={
                                ele.image
                                  ? ele.image
                                  : require('../../../assets/img/logo.png')
                              }
                              className="img-fluid"
                              alt="#"
                            />
                          </Link>
                        </div>
                        <div className="quizcontent">
                          <Link to="#">
                            <h4>{ele.name ? ele.name : 'NA'}</h4>
                          </Link>
                          <p className="mb-0">
                            {ele.description ? ele.description : 'NA'}
                          </p>
                        </div>
                        <button
                          className={`btn ${
                            ele.status === 'active'
                              ? 'activebtn'
                              : 'inactivebtn'
                          }`}
                        >
                          {ele.status === 'active' ? 'Active' : 'Inactive'}
                        </button>
                      </div>
                      <div className="quizamounts">
                        <div className="text-center">
                          <p>Total Questions</p>
                          <span>
                            {ele.questions_count ? ele.questions_count : 'NA'}
                          </span>
                        </div>
                        <div className="text-center">
                          <p>Winning Amount</p>
                          <span>
                            {ele.winning_amount ? ele.winning_amount : 0} ₹
                          </span>
                        </div>
                        <div className="text-center">
                          <p>Entry Fee</p>
                          <span>
                            {ele.quiz_type && ele.quiz_type === 'free'
                              ? 'free'
                              : `${ele.entry_fee ? ele.entry_fee : 0} ₹`}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* head to head view */}
              <div
                className={`tab-pane ${toggle === 'contest' ? 'active' : ''}`}
                id="contest"
                role="tabpanel"
              >
                {contestList.map((ele, index) => {
                  return (
                    <div className="quizboxouter" onClick={()=>{
                      props.history.push("/user/contest-detail/"+ele.id)
                    }}>
                      <div className="quizdetails">
                        <div className="quizimg">
                          <Link to="#">
                            <img
                              src={
                                ele.image
                                  ? ele.image
                                  : require('../../../assets/img/logo.png')
                              }
                              className="img-fluid"
                              alt="#"
                            />
                          </Link>
                        </div>
                        <div className="quizcontent">
                          <Link to="#">
                            <h4>{ele.name ? ele.name : 'NA'}</h4>
                          </Link>
                          <p className="mb-0">
                            {ele.description ? ele.description : 'NA'}
                          </p>
                        </div>
                        <button className={`btn ${
                            ele.status === 'active'
                              ? 'activebtn'
                              : 'inactivebtn'
                          }`}>Active</button>
                      </div>
                      <div className="quizamounts">
                        <div className="text-center">
                          <p>Total Questions</p>
                          <span>{ele.questions_count ? ele.questions_count : 'NA'}</span>
                        </div>
                        <div className="text-center">
                          <p>Winning Amount</p>
                          <span>{ele.winning_amount ? ele.winning_amount : 0} ₹</span>
                        </div>
                        <div className="text-center">
                          <p>Entry Fee</p>
                          <span>{ele.quiz_type && ele.quiz_type === 'free'
                              ? 'free'
                              : `${ele.entry_fee ? ele.entry_fee : 0} ₹`}</span>
                        </div>
                      </div>
                      <div className="statusouter">
                        <div className="bar-three bar-con">
                          <div className="bar" data-percent={70} />
                        </div>
                        <div className="d-flex">
                          <span>Only 8,631 spots left</span>{' '}
                          <span>50,000 Teams</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
        <Buttom active={"home"}/>
      </div>
    </section>
  );
};

const mapStateToProps = function (state) {
  return {
    state: state,
  };
};

export default connect(mapStateToProps)(Contest);
