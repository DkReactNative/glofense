import {connect} from 'react-redux';
import React, {useEffect, useState} from 'react';
import WebBg from '../../../components/web-bg';
import {getService} from '../../../services/getService';
import WebHeader from '../../../components/web-header';
import {formateDate} from '../../../helpers/commonHelpers';
import {showDangerToast, showToast} from '../../../components/toastMessage';
import * as CryptoJS from 'crypto-js';
import Loader from '../../../components/loader';
const PaymentComplete = (props) => {
  const [effect, setEffect] = useState(true);
  const [accounDetail, setDetail] = useState({});
  const [loading, setLoading] = useState(false);
  const [commondetail, setCommondetail] = useState({});
  const [user, setUser] = useState(
    props.state && props.state.user ? props.state.user : {}
  );
  useEffect(() => {
    console.log('payment data =>', atob(props.match.params.id));
    setLoading(true);
    document.body.style.overflow = 'text';
    getService(`get-account-details`)
      .then((response) => {
        setLoading(false);
        console.log(response);
        response = response['data'];
        if (response.success) {
          setDetail(response.results);
        } else {
          showDangerToast(response.msg);
        }
      })
      .catch((err) => {
        setLoading(false);
        showDangerToast(err.message);
      });

    getService(`get-comman-details`)
      .then((response) => {
        setLoading(false);
        console.log(response);
        response = response['data'];
        if (response.success) {
          setCommondetail(response.results);
        } else {
          showDangerToast(response.msg);
        }
      })
      .catch((err) => {
        setLoading(false);
        showDangerToast(err.message);
      });
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [effect]);

  return (
    <section className="body-inner-P">
      <div className="web-container">
        <WebBg />
        <Loader loading={loading} className="loading-component-modal" />
        <div class="web-left-container bgCurve">
          <div class="editprofile">
            <div className="header_height">
              <WebHeader
                title={'TRANSACTIONS'}
                history={props.history}
                arrow={true}
              />
            </div>
            <div className="tabboxs">
              <div className="Addcash"></div>
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

export default connect(mapStateToProps)(PaymentComplete);
