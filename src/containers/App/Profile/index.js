import {connect} from 'react-redux';
import React, {useEffect, useState} from 'react';
import {Link, Redirect} from 'react-router-dom';
import WebBg from '../../../components/web-bg';
import {getService} from '../../../services/getService';
import Buttom from '../../../components/buttomTabBar';
import WebHeader from '../../../components/web-header';
import Loader from '../../../components/loader';
import { showDangerToast } from '../../../components/toastMessage';
const Profile = (props) => {
  const [user, setUser] = useState(
    props.state && props.state.user ? props.state.user : {}
  );
  const [effect, setEffect] = useState(true);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    getUserProfile();
  }, [effect]);

  const getUserProfile = () => {
    setLoading(true)
    getService(`get-profile`)
      .then((response) => {
        setLoading(false)
        response = response['data'];
        if (response.success) setUser(response.results);
      })
      .catch((err) => {
        setLoading(false);
        showDangerToast(err.message)
      });
  };

  const captlizeName = (name) => {
    return name.charAt(0).toUpperCase() + name.substr(1);
  };

  return (
    <section className="body-inner-P">
      <div className="web-container">
        <WebBg />
        <Loader loading={loading} className="loading-component-modal" />
        <div className="web-left-container bgCurve">
          <div className="pageheaderouter">
            <div className="tab-content">
              <div className="tab-pane active" id="profile" role="tabpanel">
                <div className="header_height profileboxcenter">
                  <WebHeader
                    title={'PROFILE'}
                    history={props.history}
                    arrow={true}
                    notification={false}
                  />
                  <div className="userprofietop text-center mt-3">
                    <div className="profileimg">
                      <img
                        src={
                          user.image
                            ? user.image
                            : require('../../../assets/img/header_profile.png')
                        }
                        alt="#"
                      />
                    </div>
                    <h4>
                      <Link to="#">
                        {user.first_name ? captlizeName(user.first_name) : ''}{' '}
                        {user.last_name ? captlizeName(user.last_name) : ''}
                      </Link>
                    </h4>
                  </div>
                </div>
                <div className="contestquiz">
                  <div className="serdetails mb-4">
                    <p style={{color: 'black', fontWeight: 'bold'}}>
                      <span>Unique Code</span> {user._id ? user._id : ''}
                    </p>
                    <p>
                      <span>Email Address</span>{' '}
                      {user.email ? captlizeName(user.email) : ''}
                    </p>
                    <p>
                      <span>Phone Number</span>
                      {user.phone ? ' +91 ' + user.phone : 'NA'}
                    </p>
                    <p>
                      <span>Gender</span>{' '}
                      {user.gender
                        ? user.gender === 'male'
                          ? 'Male'
                          : user.gender === 'female'
                          ? 'Female'
                          : 'NA'
                        : 'NA'}
                    </p>
                  </div>
                  <div className="joinbtn text-center">
                    <button
                      className="btn"
                      onClick={() => {
                        props.history.push('edit-profile');
                      }}
                    >
                      Edit Profile
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <Buttom active={'profile'} />
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

export default connect(mapStateToProps)(Profile);
