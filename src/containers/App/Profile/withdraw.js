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
const Withdraw = (props) => {
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
              title={'WITHDRAW'}
              history={props.history}
              arrow={true}
            />
          </div>
          <div className="tabboxs">
            <div className="list-group" id="myList" role="tablist">
              <a
                className="list-group-item list-group-item-action"
                data-toggle="list"
                href="#home"
                role="tab"
              >
                Phone &amp; Email
              </a>
              <a
                className="list-group-item list-group-item-action"
                data-toggle="list"
                href="#profile"
                role="tab"
              >
                Pan
              </a>
              <a
                className="list-group-item list-group-item-action active"
                data-toggle="list"
                href="#messages"
                role="tab"
              >
                Bank
              </a>
            </div>
            <div className="tab-content p-3">
              <div className="tab-pane" id="home" role="tabpanel">
                <div className="numberverify">
                  <span className="mibileicon">
                    <i className="fas fa-mobile-alt" />
                  </span>
                  <span className="headlines">
                    <h5>Your Mobile number is verified</h5>
                    <span className="d-block">
                      <a href="#">9856852452</a>
                    </span>
                  </span>
                </div>
                <div className="withdrawmainouter">
                  <div className="Verifyemail">
                    <a href="#">
                      <i className="fas fa-envelope" /> Verify your email
                    </a>
                  </div>
                  <div className="socialbtn">
                    <button className="fbbtn btn mr-2">facebook</button>
                    <button className="googlebtn btn ml-2">Google</button>
                  </div>
                  <p className="permission">
                    We Won't post anything without your permission
                  </p>
                  <div className="oroption">
                    <span>OR</span>
                  </div>
                  <div className="verifyemailaddress">
                    <label>Email Address</label>
                    <input
                      type="email"
                      placeholder
                      className="form-control mb-3"
                      name
                    />
                    <p>We will send you a verification link on this email</p>
                  </div>
                  <div className="joinbtn text-center mt-4">
                    <button className="btn w-100 mb-0">Verify</button>
                  </div>
                </div>
              </div>
              <div className="tab-pane" id="profile" role="tabpanel">
                <div className="withdrawmainouter">
                  <div className="Verifyemail">
                    <a href="#">
                      <i className="fas fa-id-card" /> Verify your Pan
                    </a>
                  </div>
                  <div className="panverifyform">
                    <div className="form-group">
                      <button className="btn">
                        Upload pan card image
                        <input type="file" name />
                      </button>
                      <img src="img/dummy.png" alt="#" className="img-fluid" />
                    </div>
                    <div className="form-group">
                      <label>Name</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="As on Pan Card"
                        name
                      />
                    </div>
                    <div className="form-group">
                      <label>Pan Number</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="10 Digits PAN No."
                        name
                      />
                    </div>
                    <div className="form-group">
                      <label>Date of Birth *</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder
                        name
                      />
                    </div>
                    <div className="form-group">
                      <label>Select State</label>
                      <select
                        className="custom-select form-control"
                        id="inputGroupSelect01"
                      >
                        <option selected>Choose...</option>
                        <option value={1}>One</option>
                        <option value={2}>Two</option>
                        <option value={3}>Three</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>IFSC Code</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder
                        name
                      />
                    </div>
                  </div>
                  <div className="joinbtn text-center mt-4">
                    <button className="btn w-100 mb-0">Verify</button>
                  </div>
                </div>
              </div>
              <div className="tab-pane active" id="messages" role="tabpanel">
                <div className="withdrawmainouter">
                  <div className="Verifyemail">
                    <a href="#">
                      <i className="fas fa-home" /> Verify Bank Account{' '}
                      <span>(Verify your account to withdraw winnings)</span>
                    </a>
                  </div>
                  <div className="panverifyform">
                    <div className="form-group">
                      <button className="btn">
                        Upload Account Proof
                        <input type="file" name />
                      </button>
                      <img src="img/dummy.png" alt="#" className="img-fluid" />
                      <p>
                        <strong>
                          Bank proof of passbook, cheque book or bank statement
                          which shows your Name, IFSC code &amp; Account No.
                        </strong>
                      </p>
                    </div>
                    <div className="form-group">
                      <label>Account Number</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Your bank Details account number"
                        name
                      />
                    </div>
                    <div className="form-group">
                      <label>Retype Account Number</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder
                        name
                      />
                    </div>
                    <div className="form-group">
                      <label>IFSC Code</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder
                        name
                      />
                    </div>
                    <div className="form-group">
                      <label>Bank Name</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder
                        name
                      />
                    </div>
                  </div>
                  <div className="joinbtn text-center mt-4">
                    <button className="btn w-100 mb-0">Submit</button>
                  </div>
                </div>
              </div>
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

export default connect(mapStateToProps)(Withdraw);
