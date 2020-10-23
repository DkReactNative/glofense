import {connect} from 'react-redux';
import React, {useEffect, useState} from 'react';
import WebBg from '../../../components/web-bg';
import {getService} from '../../../services/getService';
import WebHeader from '../../../components/web-header';
import {showDangerToast, showToast} from '../../../components/toastMessage';
import Modal from 'react-bootstrap/Modal';
import Input from '../../../components/Input';
import Validation from '../../../validations/validation_wrapper';
import {postService} from '../../../services/postService';
var disable = false;
const MyAccount = (props) => {
  const [effect, setEffect] = useState(true);
  const [accounDetail, setDetail] = useState({});
  const [code, setCode] = useState('');
  const [codeError, setError] = useState('');
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [effect]);
  const [showRedem, setShowRedem] = useState(false);

  useEffect(() => {
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
  }, []);
  const applyCoupon = () => {
    if (disable) return;
    disable = 1;
    let codeError = Validation('redemCode', code);
    if (codeError) {
      setError(codeError);
      disable = false;
      return;
    }
    postService(`apply-couppon`, JSON.stringify({coupon_code: code}))
      .then((response) => {
        disable = false;
        console.log(response);
        response = response['data'];
        if (response.success) {
          showToast(response.msg);
        } else {
          showDangerToast(response.msg);
        }
      })
      .catch((err) => {
        disable = false;
        showDangerToast(err.message);
      });
  };
  return (
    <section className="body-inner-P">
      <div className="web-container">
        <WebBg />

        <div className="tab-pane" id="messages" role="tabpanel">
          <div className="header_height">
            <WebHeader
              title={'MY ACCOUNT'}
              history={props.history}
              arrow={true}
            />
          </div>
          <div className="totalbalence">
            <div className="text-center pt-2 pb-2">
              <h4>Total Balance</h4>
              <span className="balanceadd d-block mt-2 mb-2">
                <strong>
                  {' '}
                  ₹{' '}
                  {accounDetail.total_balance ? accounDetail.total_balance : 0}
                </strong>
              </span>
              <button
                className="addmoney btn"
                onClick={() => {
                  showToast('Coming soon...');
                }}
              >
                Add Balance
              </button>
            </div>
            <div className="depositedtable">
              <div>
                <p>
                  Deposited{' '}
                  <span>
                    ₹{' '}
                    {accounDetail.deposit_amount
                      ? accounDetail.deposit_amount
                      : 0}
                  </span>
                </p>
              </div>
              <div>
                <i
                  className="fas fa-info-circle"
                  data-toggle="tooltip"
                  data-placement="bottom"
                  title="Money deposited by you can use to join any contests but can't withdraw"
                />
              </div>
            </div>
            <div className="depositedtable">
              <div>
                <p>
                  <span>
                    ₹{' '}
                    {accounDetail.winngs_amount
                      ? accounDetail.winngs_amount
                      : 0}
                  </span>{' '}
                  Winnings{' '}
                </p>
              </div>
              <div>
                <button
                  className="addmoney btn"
                  onClick={() => {
                    props.history.push('/user/withdraw');
                  }}
                >
                  Withdraw
                </button>
                <i
                  className="fas fa-info-circle"
                  data-toggle="tooltip"
                  data-placement="bottom"
                  title="Money that you can withdraw or re-use to join any contets"
                />
              </div>
            </div>
            <div className="depositedtable">
              <div>
                <p>
                  <span>₹ {accounDetail.bonus ? accounDetail.bonus : 0}</span>{' '}
                  Cash Bonus{' '}
                </p>
              </div>
              <div>
                <i
                  className="fas fa-info-circle"
                  data-toggle="tooltip"
                  data-placement="bottom"
                  title="Money that can you use to join any public contest"
                />
              </div>
            </div>
          </div>
          <div
            className="totalbalence"
            onClick={() => {
              setShowRedem(true);
            }}
          >
            <h5 data-toggle="modal" data-target="#exampleModalLong">
              Redeem Coupon{' '}
              <span className="float-right">
                <i className="fas fa-chevron-right" />
              </span>
            </h5>
          </div>
          <div
            className="totalbalence"
            onClick={() => {
              props.history.push('/user/transactions');
            }}
          >
            <h5>
              Transactions{' '}
              <span className="float-right">
                <i className="fas fa-chevron-right" />
              </span>
            </h5>
          </div>
        </div>
      </div>
      <Modal
        aria-labelledby="exampleModalLabel"
        show={showRedem}
        className={'modalresize'}
        onHide={() => {
          setCode('');
          setShowRedem(false);
        }}
      >
        <Modal.Body className={'redeemcouponmodal p-4'}>
          <div className="text-center">
            <h3 className="mb-3">
              <strong> Redeem Coupon </strong>
            </h3>
            <Input
              type="text"
              style={{padding: 20}}
              name="loginInput"
              className="form-control"
              placeholder="Invite Code"
              value={code}
              onBlur={(e) => {
                setCode(e.target.value);
                setError(Validation('redemCode', e.target.value));
              }}
              onChange={(e) => {
                setCode(e.target.value);
                setError(Validation('redemCode', e.target.value));
              }}
              error={codeError}
            />
            <div className="d-flex">
              <button
                className="btn mr-2"
                onClick={() => {
                  applyCoupon();
                }}
              >
                Apply
              </button>
              <button
                className="btn ml-2"
                onClick={() => {
                  setCode('');
                  setShowRedem(false);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </section>
  );
};

const mapStateToProps = function (state) {
  return {
    state: state,
  };
};

export default connect(mapStateToProps)(MyAccount);
