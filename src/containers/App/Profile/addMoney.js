import {connect} from 'react-redux';
import React, {useEffect, useState} from 'react';
import WebBg from '../../../components/web-bg';
import {getService} from '../../../services/getService';
import WebHeader from '../../../components/web-header';
import {formateDate} from '../../../helpers/commonHelpers';
import {showDangerToast, showToast} from '../../../components/toastMessage';
import * as CryptoJS from 'crypto-js';
import Loader from '../../../components/loader';
import Modal from 'react-bootstrap/Modal';
import Input from '../../../components/Input';
const AddMoney = (props) => {
  const [effect, setEffect] = useState(true);
  var signature = '';
  const [accounDetail, setDetail] = useState({});
  const [loading, setLoading] = useState(false);
  const [commondetail, setCommondetail] = useState({});
  const [user, setUser] = useState(
    props.state && props.state.user ? props.state.user : {}
  );
  const [mySignature, setSignature] = useState();
  const [showModal, setModal] = useState(false);
  const [amount, setAmount] = useState(500);
  useEffect(() => {
    console.log(CryptoJS);
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

  const generateSignature = (commondetail) => {
    let orderID = commondetail._id + new Date().getTime();
    setCommondetail({...commondetail, ...{orderId: orderID}});
    console.log(commondetail);
    var postData = {
      appId: commondetail.cash_app_id,
      orderId: orderID,
      orderAmount: amount,
      orderCurrency: 'INR',
      orderNote: 'Test',
      customerName: user.first_name,
      customerPhone: user.phone,
      customerEmail: user.email,
      returnUrl: 'http://localhost:3001/mydata',
      notifyUrl: 'http://localhost:3001/mydata',
    };
    var orderedPostData = {};
    Object.keys(postData)
      .sort()
      .forEach(function (key) {
        orderedPostData[key] = postData[key];
      });
    console.log('orderedPostData =>', orderedPostData);
    var signatureData = '';
    for (const key in orderedPostData) {
      signatureData += key + orderedPostData[key];
    }
    console.log('signatureData =>', signatureData);
    var hash = CryptoJS.HmacSHA256(signatureData, commondetail.cash_secret);
    var signature = CryptoJS.enc.Base64.stringify(hash);
    console.log('signature =>', signature);
    setSignature(signature);
  };

  return (
    <section className="body-inner-P">
      <div className="web-container">
        <WebBg />
        <Loader loading={loading} className="loading-component-modal" />
        <Modal
          aria-labelledby="exampleModalLabel"
          show={showModal}
          className={'modalresize'}
          onHide={() => {
            setModal(false);
          }}
        >
          <Modal.Body className={'redeemcouponmodal p-4'}>
            <div className="amountprice">
              <div>Amount to be added</div>
              <div>₹ {amount}</div>
            </div>
            <div className="cashfree">
              <div>
                <img
                  src={require('../../../assets/img/cashfree.png')}
                  alt="#"
                />
              </div>
              <div
                style={{cursor: 'pointer'}}
                onClick={() => {
                  setTimeout(() => {
                    document.getElementById('redirectForm').submit();
                  }, 1000);
                }}
              >
                CashFree
              </div>
            </div>
          </Modal.Body>
        </Modal>
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
              <div className="Addcash">
                <div className="currentbalence">
                  <div>Current Balance</div>
                  <div>₹ {user.total_balance ? user.total_balance : 0}</div>
                </div>
                <div className="accountcash">
                  <h4 className="text-center">Add cash to your account</h4>
                  <div className="form-group">
                    <label>Amount to Add</label>
                    <Input
                      type="text"
                      name="amount"
                      placeholder="500"
                      value={amount}
                      onBlur={(e) => setAmount(+e.target.value)}
                      onChange={(e) => setAmount(+e.target.value)}
                    />
                  </div>
                  <div className="cashopction">
                    <div>
                      <button
                        className="btn"
                        onClick={() => {
                          setAmount(100);
                        }}
                      >
                        ₹ 100
                      </button>
                    </div>
                    <div>
                      <button
                        className="btn"
                        onClick={() => {
                          setAmount(200);
                        }}
                      >
                        ₹ 200
                      </button>
                    </div>
                    <div>
                      <button
                        className="btn"
                        onClick={() => {
                          setAmount(500);
                        }}
                      >
                        ₹ 500
                      </button>
                    </div>
                  </div>
                  <div className="joinbtn text-center mt-4">
                    <button
                      className="btn w-100 mb-0"
                      data-toggle="modal"
                      onClick={() => {
                        setModal(true);
                        generateSignature(commondetail);
                      }}
                      data-target="#exampleModal"
                    >
                      Add Cash
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <form
              id="redirectForm"
              method="post"
              action="https://test.cashfree.com/billpay/checkout/post/submit"
            >
              <input
                type="text"
                className="form-pay"
                name="appId"
                value={commondetail.cash_app_id}
              />
              <input
                type="text"
                className="form-pay"
                name="orderId"
                value={commondetail.orderId}
              />
              <input
                className="form-pay"
                type="text"
                name="orderAmount"
                value={amount}
              />
              <input
                className="form-pay"
                type="text"
                name="orderCurrency"
                value="INR"
              />
              <input
                className="form-pay"
                type="text"
                name="orderNote"
                value={'Test'}
              />
              <input
                className="form-pay"
                type="text"
                name="customerName"
                value={user.first_name}
              />
              <input
                className="form-pay"
                type="text"
                name="customerEmail"
                value={user.email}
              />
              <input
                className="form-pay"
                type="text"
                name="customerPhone"
                value={user.phone}
              />
              <input
                className="form-pay"
                type="text"
                name="returnUrl"
                value={'http://localhost:3001/mydata'}
              />
              <input
                className="form-pay"
                type="text"
                name="notifyUrl"
                value="http://localhost:3001/mydata"
              />
              <input
                className="form-pay"
                type="text"
                name="signature"
                value={mySignature}
              />
            </form>
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

export default connect(mapStateToProps)(AddMoney);
