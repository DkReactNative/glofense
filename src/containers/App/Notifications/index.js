import {connect} from 'react-redux';
import React, {useEffect, useState} from 'react';
import {Link, Redirect} from 'react-router-dom';
import WebBg from '../../../components/web-bg';
import {getService} from '../../../services/getService';
import Buttom from '../../../components/buttomTabBar';
import WebHeader from '../../../components/web-header';
import {formateDate} from '../../../helpers/commonHelpers';
const Notifications = (props) => {
  const [notificationList, setnotificationList] = useState([]);
  const [effect, setEffect] = useState(true);
  var currentPage = 0;

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    getNewsList();
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [effect]);

  const getNewsList = (page = currentPage + 1) => {
    currentPage = page;
    getService(`get-notification?page=${page}&itemsPerPage=1000`)
      .then((response) => {
        response = response['data'];
        // setCurrentPage(page)
        let array = [...notificationList];
        array = response['results']['docs'];
        setnotificationList(array);
      })
      .catch((err) => {});
  };

  return (
    <section className="body-inner-P">
      <div className="web-container">
        <WebBg />

        <div className="tab-pane" id="messages" role="tabpanel">
          <div className="header_height">
            <WebHeader
              title={'Notification'}
              history={props.history}
              arrow={true}
            />
          </div>
          <div className="newslist">
            {notificationList.map((ele, index) => {
              return (
                <li key={index}>
                  <Link to={'#'}>
                    <h5>{ele.title ? ele.title : 'NA'}</h5>
                    <p style={{textOverflow: 'ellipsis'}}>
                      {ele.content
                        ? ele.content.length > 100
                          ? ele.content.substr(0, 100) + '...'
                          : ele.content
                        : 'NA'}
                    </p>
                    <span className="newadate">
                      {formateDate(
                        ele.created_at ? ele.created_at : new Date(),
                        'MMM DD. YYYY hh:mm A'
                      )}
                    </span>
                  </Link>
                </li>
              );
            })}
            {notificationList.length === 0 && (
              <div className="joincontest">
                <div>
                  <Link to="/user">
                    <img
                      src={require('../../../assets/img/logo.png')}
                      alt="#"
                    />
                  </Link>
                  <p>No notification found </p>
                </div>
              </div>
            )}
          </div>
        </div>
        <Buttom active={'home'} />
      </div>
    </section>
  );
};

const mapStateToProps = function (state) {
  return {
    state: state,
  };
};

export default connect(mapStateToProps)(Notifications);
