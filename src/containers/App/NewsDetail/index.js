import {connect} from 'react-redux';
import React, {useEffect, useState} from 'react';
import {Link, Redirect} from 'react-router-dom';
import WebBg from '../../../components/web-bg';
import {getService} from '../../../services/getService';
import Buttom from '../../../components/buttomTabBar';
import WebHeader from '../../../components/web-header';
import {formateDate} from '../../../helpers/commonHelpers';
const NewsDetail = (props) => {
  const newsId = props.match.params.id;
  const [newsDetail, setNewsDetail] = useState({});
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
    getService(`get-news/${newsId}`)
      .then((response) => {
        response = response['data'];
        setNewsDetail(response.results);
      })
      .catch((err) => {});
  };

  return (
    <section className="body-inner-P">
      <div className="web-container">
        <WebBg />

        <div className="tab-pane" id="messages" role="tabpanel">
          <div className="header_height">
            <WebHeader title={newsDetail.title ? newsDetail.title : 'News Detail'} />
          </div>
          <div className="newslist">
            <li>
              <Link to="#" style={{maxHeight: '100vh'}}>
                <h5>{newsDetail.title ? newsDetail.title : 'NA'}</h5>
                <p style={{textOverflow: 'ellipsis'}}>
                  {newsDetail.content ? newsDetail.content : 'NA'}
                </p>
                <span className="newadate">
                  {formateDate(
                    newsDetail.created_at ? newsDetail.created_at : new Date(),
                    'MMM DD. YYYY hh:mm A'
                  )}
                </span>
              </Link>
            </li>
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

export default connect(mapStateToProps)(NewsDetail);
