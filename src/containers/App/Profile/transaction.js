import {connect} from 'react-redux';
import React, {useEffect, useState} from 'react';
import WebBg from '../../../components/web-bg';
import {getService} from '../../../services/getService';
import WebHeader from '../../../components/web-header';
import {formateDate} from '../../../helpers/commonHelpers';
import {showDangerToast, showToast} from '../../../components/toastMessage';
const Transaction = (props) => {
  const [effect, setEffect] = useState(true);
  const [accounDetail, setDetail] = useState({});
  const [transactions, setTran] = useState([]);
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    getService(`get-account-details`)
      .then((response) => {
        console.log(response);
        response = response['data'];
        if (response.success) {
          setDetail(response.results);
        } else {
          showDangerToast(response.msg);
        }
      })
      .catch((err) => {
        showDangerToast(err.message);
      });
    getService(`account-statement?page=1&itemsPerPage=100`)
      .then((response) => {
        console.log(response);
        response = response['data'];
        if (response.success) {
          setTran(response.results);
        } else {
          showDangerToast(response.msg);
        }
      })
      .catch((err) => {
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

        <div className="tab-pane" id="messages" role="tabpanel">
          <div className="header_height">
            <WebHeader
              title={'TRANSACTIONS'}
              history={props.history}
              arrow={true}
            />
          </div>

          <div className="walletamount text-center">
            <h5>
              <img
                src={require('../../../assets/img/monny.png')}
                alt="#"
                className="mr-2"
              />{' '}
              You Total balance
            </h5>
            <h2>
              {accounDetail.total_balance ? accounDetail.total_balance : 0}{' '}
              <span> ₹</span>
            </h2>
            <div className="mainouterdiv">
              <div>
                <h4>Cash Bonus</h4>
                <h3>
                  {accounDetail.bonus ? accounDetail.bonus : 0} <span>₹</span>
                </h3>
              </div>
              <div>
                <h4>Winning</h4>
                <h3>
                  {accounDetail.winngs_amount ? accounDetail.winngs_amount : 0}{' '}
                  <span>₹</span>
                </h3>
              </div>
              <div>
                <h4>Deposit</h4>
                <h3>
                  {accounDetail.deposit_amount
                    ? accounDetail.deposit_amount
                    : 0}{' '}
                  <span>₹</span>
                </h3>
              </div>
            </div>
          </div>
          <div className="translation-history">
            <h3>Last {transactions.length} transactions history</h3>
            <ul className="translationlist">
              {transactions.map((ele, index) => {
                ele = ele.rows;
                return (
                  <li
                    className={
                      ele.credit || ele.credit === 0 ? 'receive' : 'sender'
                    }
                    key={index}
                  >
                    <span className="sendresevicon">
                      <img
                        src={require('../../../assets/img/' +
                          (ele.credit || ele.credit === 0
                            ? 'receive.png'
                            : 'send.png'))}
                        alt="#"
                      />
                    </span>
                    <span className="sendcontent">
                      <div>
                        <h4>{ele.remarks ? ele.remarks : 'NA'}</h4>
                        <span>
                          {' '}
                          {formateDate(
                            new Date(ele.createdAt),
                            'MMM DD, YYYY hh:mm A'
                          )}
                        </span>
                      </div>
                      <div className="accountmonny text-right">
                        <h4
                          className={
                            ele.credit || ele.credit === 0 ? 'text-success' : ''
                          }
                        >
                          {ele.credit || ele.credit === 0
                            ? '+ ' + ele.credit
                            : ele.debit | (ele.debit === 0)
                            ? '- ' + ele.debit
                            : 0}{' '}
                          <span>₹</span>
                        </h4>
                        <span>{ele.balance ? ele.balance : 0}₹</span>
                      </div>
                    </span>
                  </li>
                );
              })}
            </ul>
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

export default connect(mapStateToProps)(Transaction);
