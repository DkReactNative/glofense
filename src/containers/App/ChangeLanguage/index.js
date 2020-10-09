import {connect} from 'react-redux';
import React, {useEffect, useState} from 'react';
import {Link, Redirect} from 'react-router-dom';
import WebBg from '../../../components/web-bg';
import Buttom from '../../../components/buttomTabBar';
import WebHeader from '../../../components/web-header';
import {getService} from '../../../services/getService';
const Changelanguage = (props) => {
  const [user, setUser] = useState(
    props.state && props.state.user ? props.state.user : {}
  );

  useEffect(() => {});

  return (
    <section className="body-inner-P">
      <div className="web-container">
        <WebBg />
        <div className="web-left-container bgCurve">
          <div className="pageheaderouter">
            <div className="tab-pane active" id="profile" role="tabpanel">
              <div className="header_height">
                <WebHeader title={'Start Quiz'} history={props.history} arrow={true}/>
              </div>
              <div className="selectlengugequiz">
                <h4>Please select your preferred language for the quiz?</h4>
                <div className="d-flex">
                  <button className="btn">Hindi</button>
                  <button className="btn">English</button>
                </div>
              </div>
              <div className="joinbtn text-center">
                <button className="btn">Start Quiz</button>
              </div>
            </div>
          </div>
          <Buttom active={'home'} />
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

export default connect(mapStateToProps)(Changelanguage);
