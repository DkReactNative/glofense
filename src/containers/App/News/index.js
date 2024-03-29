import {connect} from 'react-redux';
import React, {useEffect, useState} from 'react';
import {Link, Redirect} from 'react-router-dom';
import WebBg from '../../../components/web-bg';
import {getService} from '../../../services/getService';
import Buttom from '../../../components/buttomTabBar';
import WebHeader from '../../../components/web-header';
import {formateDate} from '../../../helpers/commonHelpers';
const Contest = (props) => {
  const [newsList, setnewsList] = useState([]);
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
    getService(`get-news?page=${page}&itemsPerPage=100`)
      .then((response) => {
        response = response['data'];
        // setCurrentPage(page)
        let array = [...newsList];
        array = response['results']['docs'];
        setnewsList(array);
      })
      .catch((err) => {});
  };

  return (
    <section className="body-inner-P">
      <div className="web-container">
        <WebBg />

        <div className="tab-pane" id="messages" role="tabpanel">
          <div className="header_height">
            <WebHeader title={'News'} />
          </div>
          <div className="newslist">
            {newsList.map((ele, index) => {
              return (
                <li key={index}>
                  <Link to={'/user/news-detail/' + ele._id}>
                    <h5>{ele.title ? ele.title : 'NA'}</h5>
                    <div dangerouslySetInnerHTML={{__html: ele.content}}></div>
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
            {newsList.length === 0 && (
              <div className="joincontest">
                <div>
                  <Link to="/user">
                    <img
                      src={require('../../../assets/img/logo.png')}
                      alt="#"
                    />
                  </Link>
                  <p>No news found </p>
                </div>
              </div>
            )}
          </div>
        </div>
        <Buttom active={'news'} />
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
