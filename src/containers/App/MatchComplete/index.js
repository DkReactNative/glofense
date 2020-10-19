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
    postService(
      'match-completed',
      JSON.stringify({status: 'completed', match_id: matchId})
    )
      .then((response) => {
        response = response['data'];
        if (response.success) {
          SetMatchDetail(response.result);
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
                    <h3>
                      {matchDetail.winner_id === user._id
                        ? 'Congrats!'
                        : 'Looser!'}
                    </h3>
                    <p>
                      {' '}
                      {matchDetail.winner_id === user._id
                        ? `You won ${matchDetail.win_amount} Rupes!`
                        : 'You have lost the match'}
                    </p>
                  </div>
                  <div className="winnercontent">
                    <div className="d-flex">
                      <h3>{}</h3>{' '}
                      <span className="points">
                        <i className="fas fa-star" />
                        {matchDetail.winner_points
                          ? matchDetail.winner_points
                          : 0}{' '}
                        Pts.
                      </span>
                    </div>
                    <p>
                      <span>Total question :- </span>
                      {matchDetail.total_question
                        ? matchDetail.total_question
                        : 0}{' '}
                    </p>
                    <p>
                      <span>Attempted :- </span>
                      {matchDetail.totalWrong + matchDetail.totalRight}{' '}
                    </p>
                    <p>
                      <span>Right :- </span>
                      {matchDetail.totalRight ? matchDetail.totalRight : 0}{' '}
                    </p>
                    <p>
                      <span>Wrong :- </span>
                      {matchDetail.totalWrong ? matchDetail.totalWrong : 0}{' '}
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
