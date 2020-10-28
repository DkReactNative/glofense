import {connect} from 'react-redux';
import React, {useEffect, useState} from 'react';
import WebBg from '../../../components/web-bg';
import {getService} from '../../../services/getService';
import WebHeader from '../../../components/web-header';
import {showDangerToast, showToast} from '../../../components/toastMessage';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
import GoogleLogin from 'react-google-login';
import Modal from 'react-bootstrap/Modal';
import Input from '../../../components/Input';
import Validation from '../../../validations/validation_wrapper';
import {postService} from '../../../services/postService';
import removeEmojis from '../../../helpers/removerEmoji';
import Loader from '../../../components/loader';
import uploadMultipleFormDataService from '../../../services/uploadMultipleFormDataService';
import Error from '../../../components/errorMessage';
import * as moment from 'moment';
import DatePicker from 'react-datepicker';
const stateList = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Chandigarh',
  'Dadra and Nagar Haveli',
  'Daman and Diu',
  'Delhi',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jammu and Kashmir',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Orissa',
  'Punjab',
  'Pondicherry',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
];
var disable = false;
const Withdraw = (props) => {
  const [firtTime, setFirstTime] = useState(true);
  const [profilePic, setPic] = useState();
  const [effect, setEffect] = useState(true);
  const [accounDetail, setDetail] = useState({});
  const [formDetail, setForm] = useState({email: props.state.user.email});
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(
    props.state && props.state.user ? props.state.user : {}
  );
  const [linkSend, setLinkSend] = useState(false);
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    getAccountDetail();
    setTimeout(() => {
      setFirstTime(false);
    }, 1000);
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [effect]);

  const getAccountDetail = () => {
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
  };
  const verifyEmail = (email) => {
    setLoading(true);
    postService(
      'send-verify-email',
      JSON.stringify({email: email.toLowerCase()})
    )
      .then((response) => {
        setLoading(false);
        console.log(response);
        response = response['data'];
        if (response.success) {
          showToast(response.msg);
          setLinkSend(true);
          getAccountDetail();
        } else {
          showDangerToast(response.msg);
        }
      })
      .catch((err) => {
        setLoading(false);
        showDangerToast(err.message);
      });
  };
  const responseFacebook = (response) => {
    console.log(response);
    if (response.email) {
      verifyEmail(response.email);
    } else {
      showDangerToast('Please link mail with your facebook');
    }
  };

  const onFacebookFail = (err) => {
    showDangerToast(err.message);
  };

  const onGoogleFail = (err) => {
    showDangerToast(err.message);
  };

  const responseGoogle = (response) => {
    console.log(response);
    verifyEmail(response.profileObj.email);
  };

  const handleChange = (evt, onlyNumber = false) => {
    const value = removeEmojis(evt.target.value);
    var error = Validation(evt.target.name, value);
    var formObj = {};
    formObj[evt.target.name + 'Error'] = error;
    formObj[evt.target.name] = onlyNumber
      ? value.replace(/[^0-9]+/g, '')
      : value;

    setForm({
      ...formDetail,
      ...formObj,
    });
  };
  const handleBlur = (evt) => {
    const value = removeEmojis(evt.target.value);
    var error = Validation(evt.target.name, value);
    var formObj = {};
    formObj[evt.target.name + 'Error'] = error;
    setForm({
      ...formDetail,
      ...formObj,
    });
  };
  const handleDate = (value) => {
    setForm({
      ...formDetail,
      ...{dob: value, dobError: Validation('dob', value)},
    });
  };

  const uploadFile = (event) => {
    if (event.target.files && event.target.files[0]) {
      let reader = new FileReader();
      let file = event.target.files[0];
      console.log(file);
      reader.onloadend = () => {
        const name = file.name;
        const lastDot = name.lastIndexOf('.');
        const ext = name.substring(lastDot + 1);
        if (
          ext === 'jpeg' ||
          ext === 'JPEG' ||
          ext === 'jpg' ||
          ext === 'JPG' ||
          ext === 'png' ||
          ext === 'PNG'
        ) {
          if (file.size > 2097152) {
            alert('File is too big. Please select image within 2mb size!');
            return;
          }
          setPic({
            imagePreview: reader.result,
            file: file,
          });
          setForm({
            ...formDetail,
            ...{
              imageError: '',
            },
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const verifyPancard = () => {
    if (disable) return;
    disable = 1;
    let imageError =
      !user.pan_image ||
      (user.pan_image &&
        user.pan_image.substr(user.pan_image.lastIndexOf('/')) === '/undefined')
        ? !profilePic || !profilePic.file
          ? 'Please upload pan card image'
          : ''
        : '';
    let nameError = Validation('name', formDetail.name);
    let panCardError = Validation('panCard', formDetail.panCard);
    let dobError = Validation('dob', formDetail.dob);
    let stateError = Validation('state', formDetail.state);

    if (nameError || panCardError || dobError || stateError || imageError) {
      setForm({
        ...formDetail,
        ...{
          nameError: nameError,
          panCardError: panCardError,
          dobError: dobError,
          stateError: stateError,
          imageError: imageError,
        },
      });
      disable = false;
      return;
    }

    let formData = new FormData();
    let data = {
      pan_name: formDetail.name,
      pan_number: formDetail.panCard,
      date_of_birth: formDetail.dob,
      state: formDetail.state,
    };
    formData.append('data', JSON.stringify(data));
    if (profilePic && profilePic.file)
      formData.append('pan_pic', profilePic.file);
    setLoading(true);
    uploadMultipleFormDataService('update-pan', formData)
      .then((response) => {
        response = response.data;
        disable = false;
        if (response.success) {
          showToast(response.msg);
          setLoading(false);
        } else {
          setLoading(false);
          showDangerToast(response.msg);
        }
      })
      .catch((err) => {
        disable = false;
        setLoading(false);
        console.log(err);
      });
  };
  return (
    <section className="body-inner-P">
      <div className="web-container">
        <WebBg />
        <Loader loading={loading} className="loading-component-modal" />
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
                className="list-group-item list-group-item-action active"
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
                className="list-group-item list-group-item-action"
                data-toggle="list"
                href="#bandetail"
                role="tab"
              >
                Bank
              </a>
            </div>

            <div className="tab-content p-3 withdraw-css">
              {/*  email and phone number tab */}
              <div className="tab-pane active" id="home" role="tabpanel">
                <div className="numberverify">
                  <span className="mibileicon">
                    <i className="fas fa-mobile-alt" />
                  </span>
                  <span className="headlines">
                    <h5>Your Mobile number is verified</h5>
                    <span className="d-block">
                      <a href="javascript:;">{user.phone}</a>
                    </span>
                  </span>
                </div>
                {accounDetail.emailverified && (
                  <div className="numberverify" style={{marginTop: 10}}>
                    <span className="mibileicon">
                      <i
                        className="fas fa-envelope"
                        style={{marginRight: 10}}
                      />
                    </span>
                    <span className="headlines">
                      <h5>Your Email is verified</h5>
                      <span className="d-block">
                        <a href="javascript:;">{user.email}</a>
                      </span>
                    </span>
                  </div>
                )}
                {!accounDetail.emailverified && !linkSend && (
                  <div className="withdrawmainouter">
                    <div className="Verifyemail">
                      <a href="#">
                        <i className="fas fa-envelope" /> Verify your email
                      </a>
                    </div>
                    <div className="socialbtn">
                      <FacebookLogin
                        appId="979110455914393"
                        fields="name,email,picture"
                        callback={responseFacebook}
                        onFailure={onFacebookFail}
                        render={(renderProps) => (
                          <button
                            onClick={renderProps.onClick}
                            className="fbbtn btn mr-2"
                          >
                            facebook
                          </button>
                        )}
                      />
                      <GoogleLogin
                        clientId="59410276792-v37oa8vqo5ebj5malribj7g0dn209bag.apps.googleusercontent.com" //CLIENTID NOT CREATED YET
                        icon={false}
                        disabled={firtTime}
                        render={(renderProps) => (
                          <button
                            onClick={renderProps.onClick}
                            className="googlebtn btn ml-2"
                          >
                            Google
                          </button>
                        )}
                        onSuccess={responseGoogle}
                        onFailure={onGoogleFail}
                      />
                    </div>
                    <p className="permission">
                      We Won't post anything without your permission
                    </p>
                    <div className="oroption">
                      <span>OR</span>
                    </div>
                    <div className="verifyemailaddress">
                      <label>Email Address</label>
                      <Input
                        type="text"
                        name="email"
                        placeholder="Email for verify"
                        value={formDetail.email}
                        onBlur={(e) => handleBlur(e)}
                        onChange={(e) => handleChange(e)}
                        error={formDetail.emailError}
                      />
                      <p>We will send you a verification link on this email</p>
                    </div>
                    <div className="joinbtn text-center mt-4">
                      <button
                        className="btn w-100 mb-0"
                        onClick={() => {
                          let emailError = Validation(
                            'email',
                            formDetail.email
                          );
                          if (emailError) {
                            setForm({
                              ...formDetail,
                              ...{
                                emailError: emailError,
                              },
                            });
                          } else {
                            verifyEmail(formDetail.email);
                          }
                        }}
                      >
                        Verify
                      </button>
                    </div>
                  </div>
                )}

                {linkSend && (
                  <div className="withdrawmainouter">
                    <div className="Verifyemail">
                      <a href="#">
                        <i className="fas fa-envelope" /> Verify your email
                      </a>
                    </div>
                    <div className="errorouter">
                      <span>
                        <img
                          src={require('../../../assets/img/erroricon.png')}
                          alt="#"
                        />
                      </span>
                      <span>
                        Click on the verification link in the mail <br /> we
                        sent you to verify your email
                      </span>
                    </div>
                    <div className="errorscontent">
                      <p>
                        Incase you don’t receive the email, be sure to Check the
                        span/junk &amp; promotions folder on your mailbox
                      </p>
                      <p>
                        Not received verification email yet?{' '}
                        <a
                          href="javascript:;"
                          onClick={() => {
                            verifyEmail(formDetail.email);
                          }}
                        >
                          Send Again
                        </a>
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Pan card tab */}
              <div className="tab-pane" id="profile" role="tabpanel">
                {!accounDetail.emailverified ? (
                  <div class="withdrawmainouter mt-4">
                    <div class="Verifyemail">
                      <a href="#">
                        <i class="fas fa-id-card"></i> Verify your Pan
                        <span>(verify your acount to withdraw winnigs)</span>
                      </a>
                      <p class="mt-4">
                        To transfer winnings to your bankDetails account, please
                        complete the steps mentioned below:
                      </p>
                      <p>1. Verify your email id</p>
                    </div>
                  </div>
                ) : (
                  <div className="withdrawmainouter">
                    {(accounDetail.pan_verified === 0 ||
                      accounDetail.pan_verified === 2) && (
                      <>
                        <div className="Verifyemail">
                          <a href="#">
                            <i className="fas fa-id-card" /> Verify your Pan
                          </a>
                        </div>
                        <div className="panverifyform">
                          <div className="form-group">
                            <button className="btn">
                              Upload pan card image
                              <input
                                type="file"
                                name="pancard-image"
                                accept=".png, .jpg, .jpeg"
                                onChange={uploadFile}
                              />
                            </button>
                            <img
                              src={
                                profilePic
                                  ? profilePic.imagePreview
                                  : user.pan_image &&
                                    user.pan_image.substr(
                                      user.pan_image.lastIndexOf('/')
                                    ) !== '/undefined'
                                  ? user.pan_image
                                  : require('../../../assets/img/dummy.png')
                              }
                              alt="pan_image"
                              className="img-fluid"
                            />
                            <Error text={formDetail.imageError} />
                          </div>
                          <div className="form-group">
                            <label>Name</label>
                            <Input
                              type="text"
                              name="name"
                              placeholder="As on Pan Card"
                              value={formDetail.name}
                              onBlur={(e) => handleBlur(e)}
                              onChange={(e) => handleChange(e)}
                              error={formDetail.nameError}
                            />
                          </div>
                          <div className="form-group">
                            <label>Pan Number</label>
                            <Input
                              type="text"
                              name="panCard"
                              placeholder="10 Digits PAN No."
                              value={formDetail.panCard}
                              onBlur={(e) => handleBlur(e)}
                              onChange={(e) => handleChange(e)}
                              error={formDetail.panCardError}
                            />
                          </div>
                          <div className="form-group">
                            <label>Date of Birth *</label>
                            <DatePicker
                              selected={
                                !formDetail.dob || formDetail.dob === ''
                                  ? null
                                  : Date.parse(
                                      moment(
                                        new Date(formDetail.dob)
                                      ).toISOString()
                                    )
                              }
                              dateFormat="dd-MM-yyyy"
                              minDate={new Date('1900/01/01')}
                              maxDate={new Date()}
                              className={'form-control'}
                              placeholderText="Date of birth"
                              onChange={handleDate}
                              onBlur={() => {
                                setForm({
                                  ...formDetail,
                                  ...{
                                    dobError: Validation('dob', formDetail.dob),
                                  },
                                });
                              }}
                              peekNextMonth
                              showMonthDropdown
                              showYearDropdown
                              dropdownMode="select"
                            />
                            <Error text={formDetail.dobError} />
                          </div>
                          <div className="form-group">
                            <label>Select State</label>
                            <select
                              className="custom-select form-control"
                              name="state"
                              value={formDetail.state}
                              onChange={handleChange}
                              onBlur={handleBlur}
                            >
                              <option value={''}>Select State</option>
                              {stateList.map((ele) => {
                                return (
                                  <option value={ele} key={ele}>
                                    {ele}
                                  </option>
                                );
                              })}
                            </select>
                            <Error text={formDetail.stateError} />
                          </div>
                        </div>
                        <div className="joinbtn text-center mt-4">
                          <button
                            className="btn w-100 mb-0"
                            onClick={() => {
                              verifyPancard();
                            }}
                          >
                            Verify
                          </button>
                        </div>
                      </>
                    )}
                    {accounDetail.pan_verified === 1 && (
                      <div className="Verifyemail text-center panreviewnext">
                        <h4>Your PAN details are under review</h4>
                        <p>
                          Your PAN details have been submitted. Please submit
                          your bank details to begin <span>KYC </span>{' '}
                          Verification.
                        </p>
                      </div>
                    )}
                    {accounDetail.pan_verified === 2 && (
                      <div className="numberverify" style={{marginTop: 10}}>
                        <span className="mibileicon">
                          <i className="fa fa-id-card" />
                        </span>
                        <span className="headlines">
                          <h5>Your PAN card is verified</h5>
                          <span className="d-block">
                            <a href="javascript:;">{user.pan_number}</a>
                          </span>
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Bank tab */}
              <div className="tab-pane" id="bandetail" role="tabpanel">
                {!accounDetail.emailverified ||
                accounDetail.pan_verified !== 2 ? (
                  <div class="withdrawmainouter mt-4">
                    <div class="Verifyemail">
                      <a href="javascript:;">
                        <i className="fas fa-home" /> Verify Bank Account{' '}
                        <span>(verify your acount to withdraw winnigs)</span>
                      </a>
                      <p class="mt-4">
                        To transfer winnings to your bankDetails account, please
                        complete the steps mentioned below:
                      </p>
                      {!accounDetail.emailverified && (
                        <p>1. Verify your email id</p>
                      )}
                      {accounDetail.pan_verified !== 2 && (
                        <p>
                          {!accounDetail.emailverified ? 2 : 1}. Verify your
                          PAN card
                        </p>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="withdrawmainouter">
                    <div className="Verifyemail">
                      <a href="javascript:;">
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
                        <img
                          src="img/dummy.png"
                          alt="#"
                          className="img-fluid"
                        />
                        <p>
                          <strong>
                            Bank proof of passbook, cheque book or bank
                            statement which shows your Name, IFSC code &amp;
                            Account No.
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
                )}
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
