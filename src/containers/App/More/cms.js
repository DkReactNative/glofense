import {connect} from 'react-redux';
import React, {useEffect, useState} from 'react';
import WebBg from '../../../components/web-bg';
import {getService} from '../../../services/getService';
import Buttom from '../../../components/buttomTabBar';
import WebHeader from '../../../components/web-header';
import {showDangerToast} from '../../../components/toastMessage';
const MoreOption = (props) => {
  const quizId = props.match.params.id;
  const [effect, setEffect] = useState(true);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [effect]);
  const [title, setTitle] = useState('');

  useEffect(() => {
    getService(`get-page-by-slug/${quizId}`)
      .then((response) => {
        console.log(response);
        response = response['data'];
        if (response.success) {
          setTitle(response.result.title);
          document.getElementById('cms-content').innerHTML =
            response.result.content;
        } else {
          showDangerToast(response.msg);
        }
      })
      .catch((err) => {
        showDangerToast(err.message);
      });
  }, []);
  return (
    <section className="body-inner-P">
      <div className="web-container">
        <WebBg />

        <div className="tab-pane" id="messages" role="tabpanel">
          <div className="header_height">
            <WebHeader title={title} history={props.history} arrow={true} />
          </div>
          <div className="innerpagecontent" id="cms-content"></div>
        </div>
        <Buttom active={'more'} />
      </div>
    </section>
  );
};

const mapStateToProps = function (state) {
  return {
    state: state,
  };
};

export default connect(mapStateToProps)(MoreOption);
