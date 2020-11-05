import React from 'react';
import {connect} from 'react-redux';
import {Link, Redirect} from 'react-router-dom';
import Modal from 'react-bootstrap/Modal';
import Input from './Input';
import Error from './errorMessage';
import Validation from '../validations/validation_wrapper';
import Loader from './loader';
import {showToast, showDangerToast, showInfoToast} from './toastMessage';
import {postService} from '../services/postService';
import removeEmojis from '../helpers/removerEmoji';
import OtpInput from 'react-otp-input';
import Session from '../helpers/session';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
import GoogleLogin from 'react-google-login';
var disable = false;
class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      checked: true,
      otpView: false,
      otp: '',
      loginModal: false,
      registerModal: false,
      forgotmodal: false,
      loginInput: '',
      loginInputError: '',
      forgotForm: {},
      loginPassword: '',
      loginPasswordError: '',
      regiterForm: {},
      loginForm: {},
      deviceInfo: {},
      user_id: null,
      remberMe: Session.getSession('remember_me') ? true : false,
      showPassword: false,
    };
  }

  componentDidMount = () => {
    console.log('props =>', this.props);
    this.props.loading(true);
  };

  static getDerivedStateFromProps = (props, state) => {
    if (props.deviceInfo) {
      state = {...state, deviceInfo: props.deviceInfo};
    }
    if (props.loginModal) {
      state = {...state, loginModal: props.loginModal};
    }
    return state;
  };

  handleModal = (modal, value) => {
    this.setState(
      {
        ...this.state,
        [modal]: value,
        otp: '',
        loginForm: {},
        regiterForm: {},
        forgotForm: {},
      },
      () => {
        console.log('modal closed');
        this.setState({otpView: false});
      }
    );
    this.props.updateLoginform();
  };

  handleChange = (evt, form, onlyNumber = false) => {
    const value = removeEmojis(evt.target.value);
    var error = Validation(
      evt.target.name,
      value,
      this.state.regiterForm.password
    );
    var formObj = this.state[form];
    formObj[evt.target.name + 'Error'] = error;
    formObj[evt.target.name] = onlyNumber
      ? value.replace(/[^0-9]+/g, '')
      : value;

    this.setState({
      ...this.state,
      [form]: formObj,
    });
  };

  handleBlur = (evt, form) => {
    const value = removeEmojis(evt.target.value);
    var error = Validation(
      evt.target.name,
      value,
      this.state.regiterForm.password
    );
    var formObj = this.state[form];
    formObj[evt.target.name + 'Error'] = error;
    this.setState({
      ...this.state,
      [form]: formObj,
    });
  };

  handleCheck = (event) => {
    this.setState({checked: !this.state.checked}, () => {
      this.setState({
        checkError: !this.state.checked ? 'This field is required' : '',
      });
    });
  };

  handleOtpChange = (otp) => {
    if (disable) return;
    this.setState({otp}, () => {
      if (otp.length === 6) {
        let body = {};
        body['device_id'] = this.state.deviceInfo.device_id;
        body['device_type'] = 'website';
        body['otp'] = this.state.otp + '';
        body['user_id'] = this.state.user_id;
        this.setState({loading: true});
        postService('verify-otp', JSON.stringify(body))
          .then((response) => {
            disable = false;
            response = response.data;
            console.log(response);
            this.setState({loading: false});
            if (response.success) {
              showToast(response.msg);
              this.setState({
                loading: false,
                otpView: false,
                loginModal: false,
                registerModal: false,
                otp: '',
              });
              Session.setSession('gloFenseUser', response.result);
              this.props.storeSeesion(response.result);
              document.getElementById('login_link').click();
            } else {
              this.setState({loading: false, otp: ''});
              showDangerToast(response.msg);
            }
          })
          .catch((err) => {
            disable = false;
            this.setState({loading: false, otp: ''});
            console.log(err);
          });
      }
    });
  };

  onSubmitLogin = () => {
    if (disable) return;
    disable = 1;
    let emailError = Validation('loginInput', this.state.loginForm.loginInput);
    let passwordError = Validation(
      'loginPassword',
      this.state.loginForm.loginPassword
    );
    if (emailError || passwordError) {
      this.setState({
        ...this.state,
        loginForm: {
          ...this.state.loginForm,
          loginInputError: emailError,
          loginPasswordError: passwordError,
        },
      });
      disable = false;
      return;
    }

    let body = {};
    body['email'] = this.state.loginForm.loginInput.toLowerCase();
    body['password'] = this.state.loginForm.loginPassword;
    body['device_id'] = this.state.deviceInfo.device_id;
    body['user_type'] = 'user';
    body['device_type'] = 'website';
    this.setState({loading: true});
    postService('login', JSON.stringify(body))
      .then((response) => {
        response = response.data;
        disable = false;
        if (response.success) {
          showToast(response.msg);
          this.props.updateLoginform();
          if (this.state.remberMe) {
            Session.setSession('remember_me', {
              loginInput: this.state.loginForm.loginInput.toLowerCase(),
              loginPassword: this.state.loginForm.loginPassword,
            });
          } else {
            Session.clearItem('remember_me');
          }
          this.setState({
            loading: false,
            loginModal: false,
            user_id: response.result.user_id,
          });
          Session.setSession('gloFenseUser', response.result);
          this.props.storeSeesion(response.result);
          const {history} = this.props;
          console.log('history =>', history);
          document.getElementById('login_link').click();
        } else {
          this.setState({loading: false});
          showDangerToast(response.msg);
          if (response.isOtpverified === 0) {
            this.setState({otpView: true, user_id: response.result.user_id});
          } else {
            //  this.setState({ loginModal:false })
          }
        }
      })
      .catch((err) => {
        disable = false;
        this.setState({loading: false});
        console.log(err);
      });
  };

  onSubmitRegister = () => {
    if (disable) return;
    disable = 1;
    let firstNameError = Validation(
      'firstName',
      this.state.regiterForm.firstName
    );
    let lastNameError = Validation('lastName', this.state.regiterForm.lastName);
    let userNameError = Validation('userName', this.state.regiterForm.userName);
    let emailError = Validation('email', this.state.regiterForm.email);
    let phoneError = Validation('phone', this.state.regiterForm.phone);
    let passwordError = Validation('password', this.state.regiterForm.password);
    // let confirm_passwordError = Validation(
    //   'confirm_password',
    //   this.state.regiterForm.confirm_password,
    //   this.state.regiterForm.password
    // );
    let checkError = !this.state.checked ? 'This field is required' : '';
    if (
      firstNameError ||
      lastNameError ||
      userNameError ||
      emailError ||
      phoneError ||
      passwordError ||
      // confirm_passwordError ||
      checkError
    ) {
      this.setState({
        ...this.state,
        checkError: checkError,
        regiterForm: {
          ...this.state.regiterForm,
          firstNameError: firstNameError,
          lastNameError: lastNameError,
          userNameError: userNameError,
          emailError: emailError,
          phoneError: phoneError,
          passwordError: passwordError,
          // confirm_passwordError: confirm_passwordError,
        },
      });
      disable = false;
      return;
    }

    let body = {};
    body['firstName'] = this.state.regiterForm.firstName;
    body['lastName'] = this.state.regiterForm.lastName;
    body['username'] = this.state.regiterForm.userName;
    body['email'] = this.state.regiterForm.email.toLowerCase();
    body['phone'] = +this.state.regiterForm.phone;
    body['password'] = this.state.regiterForm.password;
    if (this.state.regiterForm.key && this.state.regiterForm.id) {
      body[this.state.regiterForm.key] = this.state.regiterForm.id;
    }
    body['device_id'] = this.state.deviceInfo.device_id;
    body['device_type'] = 'website';
    body['referral_code'] = this.state.regiterForm.referralCode
      ? this.state.regiterForm.referralCode
      : '';
    this.setState({loading: true});
    postService('register', JSON.stringify(body))
      .then((response) => {
        response = response.data;
        disable = false;

        if (response.success) {
          showToast(response.msg);
          this.setState({
            loading: false,
            user_id: response.result.id,
            otpView: true,
          });
          console.log(response);
        } else {
          this.setState({loading: false});
          showDangerToast(response.msg);
        }
      })
      .catch((err) => {
        disable = false;
        this.setState({loading: false});
        console.log(err);
      });
  };

  onSubmitForgot = () => {
    if (disable) return;
    disable = 1;
    let emailError = Validation('email', this.state.forgotForm.email);
    if (emailError) {
      this.setState({
        ...this.state,
        forgotForm: {
          ...this.state.forgotForm,
          emailError: emailError,
        },
      });
      disable = false;
      return;
    }

    let body = {};
    body['email'] = this.state.forgotForm.email.toLowerCase();
    this.setState({loading: true});

    postService('forgot-password', JSON.stringify(body))
      .then((response) => {
        response = response.data;
        disable = false;
        if (response.success) {
          showToast(response.msg);
          this.setState({loading: false, forgotModal: false});
        } else {
          this.setState({loading: false});
          showDangerToast(response.msg);
        }
      })
      .catch((err) => {
        disable = false;
        this.setState({loading: false});
        console.log(err);
      });
  };

  responseFacebook = (response, signup = false) => {
    if (!response.email) {
      showDangerToast(
        "Facebook account doesn't have email id linked. Please try with diffrent account"
      );
      return;
    }
    let obj = {};
    obj['email'] = response.email;
    obj['key'] = 'fb_id';
    obj['id'] = response.id;
    obj['first_name'] = response.name.substr(0, response.name.indexOf(' '));
    obj['last_name'] = response.name.substr(response.name.lastIndexOf(' ') + 1);
    console.log(obj);
    this.socialLogin(obj, signup);
  };

  onFacebookFail = (err) => {
    showDangerToast(err.message);
  };

  onGoogleFail = (err) => {
    showDangerToast(err.message);
  };

  responseGoogle = (response, signup = false) => {
    response = response.profileObj;
    if (!response.email) {
      showDangerToast(
        "Google account doesn't have email id linked. Please try with diffrent account"
      );
      return;
    }
    let obj = {};
    obj['email'] = response.email;
    obj['key'] = 'google_id';
    obj['id'] = response.googleId;
    obj['first_name'] = response.name.substr(0, response.name.indexOf(' '));
    obj['last_name'] = response.name.substr(response.name.lastIndexOf(' ') + 1);
    console.log(obj);
    this.socialLogin(obj, signup);
  };

  socialLogin = (obj, signup = false) => {
    let body = {};
    body['email'] = obj.email.toLowerCase();
    body[obj.key] = obj.id;
    body['device_id'] = this.state.deviceInfo.device_id;
    body['user_type'] = 'user';
    body['device_type'] = 'website';
    this.setState({loading: true});
    postService('social-login', JSON.stringify(body))
      .then((response) => {
        response = response.data;
        disable = false;
        if (response.success) {
          showToast(response.msg);
          this.props.updateLoginform();
          this.setState({
            loading: false,
            loginModal: false,
            registerModal: false,
            user_id: response.result.user_id,
          });
          Session.setSession('gloFenseUser', response.result);
          this.props.storeSeesion(response.result);
          this.props.history.push('/user');
        } else {
          this.setState({loading: false});
          if (!signup) showDangerToast(response.msg);
          if (response.isOtpverified === 0) {
            this.setState({otpView: true, user_id: response.result.user_id});
          } else {
            showInfoToast('Please fill the missing details and register');
            this.setState({
              regiterForm: {
                email: obj.email,
                firstName: obj.first_name,
                lastName: obj.last_name,
                key: obj.key,
                socialId: obj.id,
              },
            });
            let el = document.getElementById('scroll-top');
            el.scrollIntoView({
              behavior: 'smooth',
              block: 'start',
              inline: 'start',
            });
          }
        }
      })
      .catch((err) => {
        disable = false;
        this.setState({loading: false});
        console.log(err);
      });
  };
  loginModal = () => {
    return (
      <Modal
        aria-labelledby="exampleModalLabel"
        dialogClassName="loginmodal"
        show={this.state.loginModal}
        onHide={() => {
          this.setState({loginForm: {}});
          this.props.updateLoginform();
          this.handleModal('loginModal', false);
        }}
      >
        <Modal.Body>
          {!this.state.otpView ? (
            <div className="modal-content p-4">
              <Loader
                loading={this.state.loading}
                className="loading-component-modal"
              />
              <div className="modal-header border-0 p-0">
                <h5 className="modal-title mt-3 mb-3" id="exampleModalLabel">
                  Welcome back to <span>Your Account</span>
                </h5>
              </div>
              <div className="modal-body pl-0 pr-0">
                <form>
                  <div className="form-group">
                    <Input
                      type="text"
                      name="loginInput"
                      className="form-control"
                      placeholder="Email Address/Phone number"
                      value={this.state.loginForm.loginInput}
                      onBlur={(e) => this.handleBlur(e, 'loginForm')}
                      onChange={(e) => this.handleChange(e, 'loginForm')}
                      error={this.state.loginForm.loginInputError}
                    />
                  </div>
                  <div className="form-group">
                    <Input
                      type="password"
                      name="loginPassword"
                      className="form-control"
                      placeholder="Password"
                      value={this.state.loginForm.loginPassword}
                      onBlur={(e) => this.handleBlur(e, 'loginForm')}
                      onChange={(e) => this.handleChange(e, 'loginForm')}
                      error={this.state.loginForm.loginPasswordError}
                    />
                  </div>
                  <div className="form-group form-check">
                    <span className="custom_check">
                      Remember me &nbsp;{' '}
                      <input
                        type="checkbox"
                        checked={this.state.remberMe ? true : false}
                        onChange={(event) => {
                          this.setState({remberMe: !this.state.remberMe});
                        }}
                      />
                      <span className="check_indicator">&nbsp;</span>
                    </span>
                  </div>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => {
                      this.onSubmitLogin();
                    }}
                  >
                    Sign In
                    <img src={require('../assets/img/arrow.png')} alt="#" />
                  </button>
                </form>
                <div className="socialbtn">
                  <FacebookLogin
                    appId={process.env.REACT_APP_FACEBOOK_ID}
                    fields="name,email,picture"
                    callback={this.responseFacebook}
                    onFailure={this.onFacebookFail}
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
                    clientId={process.env.REACT_APP_GOOGLE_ID} //CLIENTID NOT CREATED YET
                    icon={false}
                    render={(renderProps) => (
                      <button
                        onClick={renderProps.onClick}
                        className="googlebtn btn ml-2"
                      >
                        Google
                      </button>
                    )}
                    onSuccess={this.responseGoogle}
                    onFailure={this.onGoogleFail}
                  />
                </div>
                <div className="loginbtns text-center">
                  <p className="mt-5 mb-4">
                    <a
                      href="javascript:void(0);"
                      onClick={() => {
                        this.setState({loginModal: false, forgotModal: true});
                      }}
                    >
                      Forgot Password?
                    </a>
                  </p>
                  <p className="mb-0 signin">
                    Don't have an account?{' '}
                    <a
                      href="javascript:void(0);"
                      onClick={() => {
                        this.setState({loginModal: false, registerModal: true});
                      }}
                    >
                      Sign Up
                    </a>
                  </p>
                </div>
              </div>
            </div>
          ) : (
            this.renderOtpForm()
          )}
        </Modal.Body>
      </Modal>
    );
  };

  onResendOtp = () => {
    if (disable) return;
    disable = 1;
    let body = {};
    this.setState({otp: ''});
    body['user_id'] = this.state.user_id;
    this.setState({loading: true});
    postService('resend-otp', JSON.stringify(body))
      .then((response) => {
        response = response['data'];
        disable = 0;
        if (response.success) {
          showToast(response.msg);
          this.setState({loading: false});
        } else {
          this.setState({loading: false});
          showDangerToast(response.msg);
        }
      })
      .catch((err) => {
        disable = false;
        this.setState({loading: false});
        console.log(err);
      });
  };

  renderOtpForm = () => {
    return (
      <div className="modal-content p-4">
        <Loader
          loading={this.state.loading}
          className="loading-component-modal"
        />
        <div className="card">
          <form>
            <p>Enter verification code</p>
            <div className="margin-top--small">
              <div style={{display: 'flex'}}>
                <div style={{display: 'flex', alignItems: 'center'}}>
                  <OtpInput
                    value={this.state.otp}
                    onChange={this.handleOtpChange}
                    numInputs={6}
                    isInputNum={true}
                    containerStyle={'form-group'}
                    inputStyle={'otp-form-input'}
                  />
                </div>
              </div>
            </div>
            <div className="btn-row">
              <a
                style={{marginTop: 10, color: '#666666;', fontSize: 18}}
                href="javascript:void(0);"
                onClick={() => {
                  this.onResendOtp();
                }}
              >
                Resend OTP
              </a>
            </div>
          </form>
        </div>
      </div>
    );
  };

  registerModal = () => {
    return (
      <Modal
        aria-labelledby="exampleModalLabel2"
        dialogClassName="loginmodal"
        id="registerModal"
        show={this.state.registerModal}
        onHide={() => {
          this.handleModal('registerModal', false);
          this.setState({regiterForm: {}, otp: ''});
        }}
      >
        <Modal.Body>
          {!this.state.otpView ? (
            <div className="modal-content p-4">
              <Loader
                loading={this.state.loading}
                className="loading-component-modal"
              />
              <div className="modal-header border-0 p-0" id="scroll-top">
                <h5 className="modal-title mt-3 mb-3" id="exampleModalLabel">
                  Create Account
                </h5>
              </div>
              <div className="modal-body pl-0 pr-0">
                <form>
                  <div className="form-group">
                    <Input
                      type="text"
                      name="firstName"
                      placeholder="First name"
                      value={this.state.regiterForm.firstName}
                      onBlur={(e) => this.handleBlur(e, 'regiterForm')}
                      onChange={(e) => this.handleChange(e, 'regiterForm')}
                      error={this.state.regiterForm.firstNameError}
                    />
                  </div>
                  <div className="form-group">
                    <Input
                      type="text"
                      name="lastName"
                      placeholder="Last name"
                      value={this.state.regiterForm.lastName}
                      onBlur={(e) => this.handleBlur(e, 'regiterForm')}
                      onChange={(e) => this.handleChange(e, 'regiterForm')}
                      error={this.state.regiterForm.lastNameError}
                    />
                  </div>
                  <div className="form-group">
                    <Input
                      type="text"
                      name="userName"
                      placeholder="User name"
                      value={this.state.regiterForm.userName}
                      onBlur={(e) => this.handleBlur(e, 'regiterForm')}
                      onChange={(e) => this.handleChange(e, 'regiterForm')}
                      error={this.state.regiterForm.userNameError}
                    />
                  </div>
                  <div className="form-group">
                    <Input
                      type="text"
                      name="email"
                      placeholder="Email address"
                      value={this.state.regiterForm.email}
                      onBlur={(e) => this.handleBlur(e, 'regiterForm')}
                      onChange={(e) => this.handleChange(e, 'regiterForm')}
                      error={this.state.regiterForm.emailError}
                    />
                  </div>
                  <div className="form-group">
                    <Input
                      type="text"
                      name="phone"
                      placeholder="Mobile number"
                      maxLength={10}
                      value={this.state.regiterForm.phone}
                      onBlur={(e) => this.handleBlur(e, 'regiterForm')}
                      onChange={(e) =>
                        this.handleChange(e, 'regiterForm', true)
                      }
                      error={this.state.regiterForm.phoneError}
                    />
                  </div>
                  <div className="form-group passwordshow">
                    <Input
                      type="password"
                      name="password"
                      id="password-input"
                      placeholder="Password"
                      value={this.state.regiterForm.password}
                      onBlur={(e) => this.handleBlur(e, 'regiterForm')}
                      onChange={(e) => this.handleChange(e, 'regiterForm')}
                      error={this.state.regiterForm.passwordError}
                    />
                    <i
                      className={
                        this.state.showPassword
                          ? 'fas fa-eye'
                          : 'fas fa-eye-slash'
                      }
                      onClick={() => {
                        var x = document.getElementById('password-input');
                        if (x.type === 'password') {
                          x.type = 'text';
                          this.setState({
                            showPassword: !this.state.showPassword,
                          });
                        } else {
                          x.type = 'password';
                          this.setState({
                            showPassword: !this.state.showPassword,
                          });
                        }
                      }}
                    ></i>
                  </div>
                  {/* <div className="form-group">
                    <Input
                      type="password"
                      name="confirm_password"
                      placeholder="Confirm Password"
                      value={this.state.regiterForm.confirm_password}
                      onBlur={(e) => this.handleBlur(e, 'regiterForm')}
                      onChange={(e) => this.handleChange(e, 'regiterForm')}
                      error={this.state.regiterForm.confirm_passwordError}
                    />
                  </div> */}
                  <div className="form-group">
                    <Input
                      type="text"
                      name="referralCode"
                      maxLength={55}
                      placeholder="Referral Code If Any"
                      value={this.state.regiterForm.referralCode}
                      onBlur={(e) => this.handleBlur(e, 'regiterForm')}
                      onChange={(e) => this.handleChange(e, 'regiterForm')}
                    />
                  </div>
                  <div className="form-group form-check">
                    <span className="custom_check">
                      I Accept the terms and conditiond and Privacy policy
                      &nbsp;{' '}
                      <input
                        type="checkbox"
                        onChange={(event) => {
                          this.handleCheck(event);
                        }}
                        defaultChecked={this.state.checked}
                      />
                      <span className="check_indicator">&nbsp;</span>
                    </span>
                  </div>
                  <Error
                    text={this.state.checkError}
                    style={{marginTop: this.state.checkError ? -15 : 0}}
                  />
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => {
                      this.onSubmitRegister();
                    }}
                  >
                    Sign Up
                    <img src={require('../assets/img/arrow.png')} alt="#" />
                  </button>
                </form>
                <div className="socialbtn">
                  <FacebookLogin
                    appId={process.env.REACT_APP_FACEBOOK_ID}
                    fields="name,email,picture"
                    callback={(response) =>
                      this.responseFacebook(response, true)
                    }
                    onFailure={(response) =>
                      this.onFacebookFail(response, true)
                    }
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
                    clientId={process.env.REACT_APP_GOOGLE_ID} //CLIENTID NOT CREATED YET
                    icon={false}
                    render={(renderProps) => (
                      <button
                        onClick={renderProps.onClick}
                        className="googlebtn btn ml-2"
                      >
                        Google
                      </button>
                    )}
                    onSuccess={(response) =>
                      this.responseGoogle(response, true)
                    }
                    onFailure={(response) => this.onGoogleFail(response, true)}
                  />
                </div>
                <div className="loginbtns text-center">
                  <p className="mb-0 mt-4 signin">
                    Already have an account?{' '}
                    <a
                      href="javascript:void(0);"
                      onClick={() => {
                        this.setState({
                          loginModal: true,
                          registerModal: false,
                          loginForm: Session.getSession('remember_me')
                            ? Session.getSession('remember_me')
                            : {},
                        });
                      }}
                    >
                      Sign in
                    </a>
                  </p>
                </div>
              </div>
            </div>
          ) : (
            this.renderOtpForm()
          )}
        </Modal.Body>
      </Modal>
    );
  };

  forgotModal = () => {
    return (
      <Modal
        aria-labelledby="exampleModalLabel3"
        dialogClassName="loginmodal"
        show={this.state.forgotModal}
        onHide={() => {
          this.handleModal('forgotModal', false);
          this.setState({forgotForm: {}, otp: ''});
        }}
      >
        <Modal.Body>
          <div className="modal-content p-4">
            <Loader
              loading={this.state.loading}
              className="loading-component-modal"
            />
            <div className="modal-header border-0 p-0">
              <h5 className="modal-title mt-3 mb-3" id="exampleModalLabel">
                Forgot password
              </h5>
            </div>
            <div className="modal-body pl-0 pr-0">
              <form>
                <div className="form-group">
                  <Input
                    type="text"
                    name="email"
                    placeholder="Email Address"
                    value={this.state.forgotForm.email}
                    onBlur={(e) => this.handleBlur(e, 'forgotForm')}
                    onChange={(e) => this.handleChange(e, 'forgotForm')}
                    error={this.state.forgotForm.emailError}
                  />
                </div>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => {
                    this.onSubmitForgot();
                  }}
                >
                  Send
                  <img src={require('../assets/img/arrow.png')} alt="#" />
                </button>
              </form>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    );
  };

  onLogout = () => {
    if (window.confirm('Are you sure you want to log out?')) {
      Session.clearItem('gloFenseUser');
      this.props.logout();
    }
  };

  render() {
    return (
      <header className="navigation">
        {this.loginModal()}
        {this.registerModal()}
        {this.forgotModal()}
        <Loader loading={this.state.loading} className="loading-component" />
        <nav className="navbar navbar-expand-md">
          <div className="container">
            <Link className="logo" to="/" title="">
              <img src={require('../assets/img/logo.png')} alt="#" />
            </Link>
            <button
              className="navbar-toggler"
              type="button"
              data-toggle="collapse"
              data-target="#navbarCollapse"
              aria-controls="navbarCollapse"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon" />
              <span className="navbar-toggler-icon" />
              <span className="navbar-toggler-icon" />
            </button>
            <div className="collapse navbar-collapse" id="navbarCollapse">
              <ul className="navbar-nav d-flex ml-0 ml-lg-auto">
                <li
                  className={
                    this.props.activeClass === '/'
                      ? 'active nav-item'
                      : 'nav-item'
                  }
                >
                  <Link to={'/'} title="Home">
                    Home
                  </Link>
                </li>
                <li
                  className={
                    this.props.activeClass === '/about'
                      ? 'active nav-item'
                      : 'nav-item'
                  }
                >
                  <Link to="/about" title="About Us">
                    About Us
                  </Link>
                </li>
                {/* <li
                  className={
                    this.props.activeClass === '/services'
                      ? 'active nav-item'
                      : 'nav-item'
                  }
                >
                  <Link to="#" title="Services">
                    Services
                  </Link>
                </li> */}
                <li
                  className={
                    this.props.activeClass === '/how-it-works'
                      ? 'active nav-item'
                      : 'nav-item'
                  }
                >
                  <Link to="/how-it-works" title="How It Works">
                    How It Works
                  </Link>
                </li>
                <li
                  className={
                    this.props.activeClass === '/contact'
                      ? 'active nav-item'
                      : 'nav-item'
                  }
                >
                  <Link to="/contact" title="Contact Us">
                    Contact Us
                  </Link>
                </li>
              </ul>
              {(!this.props.user || !this.props.user.id) && (
                <ul className="home_toggle_block ml-0 ml-lg-0">
                  <li
                    className={this.state.loginModal ? 'selected' : ''}
                    onClick={() => {
                      this.handleModal('loginModal', true);
                      this.setState({
                        loginForm: Session.getSession('remember_me')
                          ? Session.getSession('remember_me')
                          : {},
                      });
                    }}
                  >
                    <Link to="#">Login</Link>
                  </li>
                  <li className={this.state.registerModal ? 'selected' : ''}>
                    <Link
                      to="#"
                      onClick={() => this.handleModal('registerModal', true)}
                    >
                      Sign up
                    </Link>
                  </li>
                </ul>
              )}

              {this.props.user && this.props.user.id && (
                <ul className="dropdown aw-user">
                  <button
                    aria-expanded="false"
                    aria-haspopup="true"
                    className="btn profile-btn"
                    data-toggle="dropdown"
                    id="dropdownMenuButton"
                    type="button"
                  >
                    <img
                      src={
                        this.props.user.image
                          ? this.props.user.image
                          : require('../assets/img/logo.png')
                      }
                      alt="Profile"
                    />
                  </button>
                  <div
                    aria-labelledby="dropdownMenuButton"
                    className="dropdown-menu"
                  >
                    <Link
                      className="dropdown-item drop-link"
                      to="/user/profile"
                    >
                      My Profile
                    </Link>
                    <Link className="dropdown-item drop-link" to="/user">
                      Play Quiz
                    </Link>
                    <Link
                      className="dropdown-item drop-link"
                      to="#"
                      onClick={() => {
                        this.onLogout();
                      }}
                    >
                      Log out
                    </Link>
                    <Link to="/user" hidden="true" id="login_link" />
                  </div>
                </ul>
              )}
            </div>
          </div>
        </nav>
      </header>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    deviceInfo: state.deviceInfo,
    loginModal: state.loginForm,
    activeClass: state.activeClass,
    user: state.user,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    storeDevice: (data) => {
      dispatch({type: 'update', payload: data});
    },
    loading: (loading) => {
      dispatch({type: 'loading', payload: loading});
    },
    storeSeesion: (user) => {
      dispatch({type: 'login_user', payload: user});
    },
    updateLoginform: () => {
      dispatch({type: 'login_form', payload: false});
    },
    logout: () => {
      dispatch({type: 'logout', payload: null});
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);
