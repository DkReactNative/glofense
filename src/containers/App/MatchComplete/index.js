import {connect, useDispatch} from 'react-redux';
import React, {useEffect, useContext, useState} from 'react';
import WebBg from '../../../components/web-bg';
import {Link, Redirect} from 'react-router-dom';
import WebHeader from '../../../components/web-header';
import {
  showToast,
  showDangerToast,
  showInfoToast,
} from '../../../components/toastMessage';
import Buttom from '../../../components/buttomTabBar';
import {postService} from '../../../services/postService';

const MatchComplete = (props) => {
  const matchId = props.match.params.id;
  const dispatch = useDispatch();
  const [user, setUser] = useState(
    props.state && props.state.user ? props.state.user : {}
  );

  const [matchDetail, SetMatchDetail] = useState({});
  const [effect, setEffect] = useState(true);

  useEffect(() => {
    getMatchDetail();
    return () => {
      console.log('I am destroyed');
    };
  }, [effect]);

  const getMatchDetail = () => {
    postService(`${'match-completed'}/${matchId}`)
      .then((response) => {
        response = response['data'];
        if (response.success) {
          SetMatchDetail(response.results);
        }
      })
      .catch((err) => {});
  };

  return (
    <section className="body-inner-P">
      <div className="web-container">
        <WebBg />
        <div className="web-left-container bgCurve">
          <div className="pageheaderouter">
            <div className="tab-content">
              <div className="tab-pane active" id="profile" role="tabpanel">
                <div className="pageheaderouter">
                  <div className="winneruserouter">
                    <div className="winnerimg">
                      <img
                        src={props.state.user.image}
                        alt="#"
                        className="userprofilein"
                      />{' '}
                      <span className="lefticon">
                        <img
                          src={require('../../../assets/img/winner-left.png')}
                          alt=""
                        />
                      </span>{' '}
                      <span className="winner-righticon">
                        <img
                          src={require('../../../assets/img/winner-right.png')}
                          alt="#"
                        />
                      </span>
                    </div>
                    <h3>Congrats!</h3>
                    <p>You won 1000 Rupes!</p>
                  </div>
                  <div className="winnercontent">
                    <div className="d-flex">
                      <h3>Amelia</h3>{' '}
                      <span className="points">
                        <i className="fas fa-star" />
                        620 Pts.
                      </span>
                    </div>
                    <p>
                      <span>Total question :- </span>20{' '}
                    </p>
                    <p>
                      <span>Attempted :- </span>18{' '}
                    </p>
                    <p>
                      <span>Right :- </span>14{' '}
                    </p>
                    <p>
                      <span>Wrong :- </span>4{' '}
                    </p>
                  </div>
                  <div className="joinbtn text-center mt-4">
                    <button className="btn">Redeem Your Award</button>
                  </div>
                </div>
              </div>
            </div>
            <Buttom active={'home'} />
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

export default connect(mapStateToProps)(MatchComplete);
