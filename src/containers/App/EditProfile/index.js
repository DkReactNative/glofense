import {connect, useDispatch} from 'react-redux';
import React, {useEffect, useState} from 'react';
import Input from '../../../components/Input';
import Validation from '../../../validations/validation_wrapper';
import removeEmojis from '../../../helpers/removerEmoji';
import {Link, Redirect} from 'react-router-dom';
import Loader from '../../../components/loader';
import Error from '../../../components/errorMessage';
import WebHeader from '../../../components/web-header';
import WebBg from '../../../components/web-bg';
import {getService} from '../../../services/getService';
import uploadMultipleFormDataService from '../../../services/uploadMultipleFormDataService';
import {showToast, showDangerToast} from '../../../components/toastMessage';
import DatePicker from 'react-datepicker';
var disable = false;
const EditProfile = (props) => {
  const dispatch = useDispatch();
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
  const [formDetail, setForm] = useState(
    props.state && props.state.user
      ? {...responseToState(props.state.user)}
      : {}
  );
  const [profilePic, setPic] = useState();
  const [effect, setEffect] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getUserProfile();
  }, [effect]);

  const getUserProfile = () => {
    getService(`get-profile`)
      .then((response) => {
        response = response['data'];
        if (response.success) {
          var form = formDetail;
          setForm({
            ...form,
            ...responseToState(response.results),
            ...{country: 'India'},
          });
        }
      })
      .catch((err) => {});
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

  const handleDate = (value) => {
    setForm({
      ...formDetail,
      ...{dob: value, dobError: Validation('dob', value)},
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

  const captlizeName = (name) => {
    return name.charAt(0).toUpperCase() + name.substr(1);
  };

  function responseToState(object) {
    let obj = {};
    obj.firstName = object.first_name;
    obj.lastName = object.last_name;
    obj.dob = object.dob;
    obj.country = object.country;
    obj.city = object.city;
    obj.state = object.state;
    obj.pincode = object.pin_code;
    obj.phone = object.phone;
    obj.gender = object.gender ? object.gender : 'male';
    return {...obj, ...object};
  }

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
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const submitForm = () => {
    if (disable) return;
    disable = 1;
    let firstNameError = Validation('firstName', formDetail.firstName);
    let lastNameError = Validation('lastName', formDetail.lastName);
    let emailError = Validation('email', formDetail.email);
    let phoneError = Validation('phone', formDetail.phone);
    let dobError = Validation('dob', formDetail.dob);
    let addressError = Validation('address', formDetail.address);
    let cityError = Validation('city', formDetail.city);
    let stateError = Validation('state', formDetail.state);
    let pincodeError = Validation('pincode', formDetail.pincode);
    let genderError = !formDetail.gender ? 'This field is required' : '';
    if (
      firstNameError ||
      lastNameError ||
      phoneError ||
      emailError ||
      pincodeError ||
      dobError ||
      addressError ||
      cityError ||
      stateError ||
      genderError
    ) {
      setForm({
        ...formDetail,
        ...{
          firstNameError: firstNameError,
          lastNameError: lastNameError,
          phoneError: phoneError,
          emailError: emailError,
          pincodeError: pincodeError,
          dobError: dobError,
          addressError: addressError,
          cityError: cityError,
          stateError: stateError,
          genderError: genderError,
        },
      });
      disable = false;
      return;
    }

    let formData = new FormData();
    let data = {
      email: formDetail.email,
      dob: formDetail.dob,
      phone: formDetail.phone,
      city: formDetail.city,
      gender: formDetail.gender ? formDetail.gender : 'male',
      state: formDetail.state,
      firstName: formDetail.firstName,
      lastName: formDetail.lastName,
      pin_code: formDetail.pincode,
      username: formDetail.username,
      address: formDetail.address,
      country: formDetail.country,
    };
    formData.append('data', JSON.stringify(data));
    if (profilePic && profilePic.file)
      formData.append('profile_pic', profilePic.file);
    setLoading(true);
    uploadMultipleFormDataService('profile', formData)
      .then((response) => {
        response = response.data;
        disable = false;

        if (response.success) {
          showToast(response.msg);
          setLoading(false);

          dispatch({type: 'update_profile', payload: response.results});
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
        <div className="web-left-container bgCurve">
          <div className="editprofile">
            <div className="header_height">
              <WebHeader
                title={'Edit Profile'}
                history={props.history}
                arrow={true}
                notification={false}
              />
            </div>
            <div className="editouter">
              <Loader loading={loading} className="loading-component" />
              <div className="text-center">
                <div className="userimgedit">
                  <img
                    src={
                      profilePic
                        ? profilePic.imagePreview
                        : formDetail.image
                        ? formDetail.image
                        : require('../../../assets/img/winneruser.png')
                    }
                    alt="#"
                  />
                  <span className="uploadimg">
                    <i className="fas fa-camera" />
                    <input
                      type="file"
                      name="profile image"
                      accept=".png, .jpg, .jpeg"
                      onChange={uploadFile}
                    />
                  </span>
                </div>
              </div>
              <div className="editform pb-0">
                <form>
                  <div className="row">
                    <div className="col-md-12">
                      <div className="form-group">
                        <Input
                          type="text"
                          name="firstName"
                          placeholder="First name"
                          value={formDetail.firstName}
                          onBlur={(e) => handleBlur(e)}
                          onChange={(e) => handleChange(e)}
                          error={formDetail.firstNameError}
                        />
                      </div>
                    </div>
                    <div className="col-md-12">
                      <div className="form-group">
                        <Input
                          type="text"
                          name="lastName"
                          placeholder="Last name"
                          value={formDetail.lastName}
                          onBlur={(e) => handleBlur(e)}
                          onChange={(e) => handleChange(e)}
                          error={formDetail.lastNameError}
                        />
                      </div>
                    </div>
                    <div className="col-md-12">
                      <div className="form-group">
                        <Input
                          type="text"
                          name="email"
                          disabled={true}
                          placeholder="Email address"
                          value={formDetail.email}
                          onBlur={(e) => handleBlur(e)}
                          onChange={(e) => handleChange(e)}
                          error={formDetail.emailError}
                        />
                      </div>
                    </div>
                    <div className="col-md-12">
                      <div className="form-group">
                        <DatePicker
                          selected={
                            !formDetail.dob || formDetail.dob === ''
                              ? null
                              : new Date(formDetail.dob)
                          }
                          dateFormat="dd/MM/yyyy"
                          minDate={new Date('1900/01/01')}
                          maxDate={new Date()}
                          className={'form-control'}
                          placeholderText="Date of birth"
                          onChange={handleDate}
                          onBlur={() => {
                            setForm({
                              ...formDetail,
                              ...{dobError: Validation('dob', formDetail.dob)},
                            });
                          }}
                          peekNextMonth
                          showMonthDropdown
                          showYearDropdown
                          dropdownMode="select"
                        />
                        <Error text={formDetail.dobError} />
                      </div>
                    </div>
                    <div className="col-md-12">
                      <div className="form-group">
                        <span className="custom_radio">
                          Male &nbsp;{' '}
                          <input
                            type="radio"
                            name="radio"
                            defaultChecked={true}
                            checked={
                              formDetail.gender && formDetail.gender === 'male'
                            }
                            onChange={() =>
                              setForm({
                                ...formDetail,
                                ...{gender: 'male', genderError: ''},
                              })
                            }
                          />
                          <span className="radio_indicator">&nbsp;</span>
                        </span>

                        <span className="custom_radio">
                          Female &nbsp;{' '}
                          <input
                            type="radio"
                            name="radio"
                            checked={
                              formDetail.gender &&
                              formDetail.gender === 'female'
                            }
                            onChange={() =>
                              setForm({
                                ...formDetail,
                                ...{gender: 'female', genderError: ''},
                              })
                            }
                          />
                          <span className="radio_indicator">&nbsp;</span>
                        </span>
                      </div>
                      <Error text={formDetail.genderError} />
                    </div>
                    <div className="col-md-12">
                      <div className="form-group">
                        <Input
                          type="text"
                          name="phone"
                          disabled={true}
                          placeholder="Mobile number"
                          maxLength={10}
                          value={formDetail.phone}
                          onBlur={(e) => handleBlur(e)}
                          onChange={(e) => handleChange(e, true)}
                          error={formDetail.phoneError}
                        />
                      </div>
                    </div>
                    <div className="col-md-12">
                      <div className="form-group">
                        <Input
                          type="text"
                          name="address"
                          placeholder="Address"
                          value={formDetail.address}
                          onBlur={(e) => handleBlur(e)}
                          onChange={(e) => handleChange(e)}
                          error={formDetail.addressError}
                        />
                      </div>
                    </div>

                    <div className="col-md-12">
                      <div className="form-group">
                        <Input
                          type="text"
                          name="city"
                          placeholder="City"
                          value={formDetail.city}
                          onBlur={(e) => handleBlur(e)}
                          onChange={(e) => handleChange(e)}
                          error={formDetail.cityError}
                        />
                      </div>
                    </div>
                    <div className="col-md-12">
                      <div className="form-group">
                        <Input
                          type="text"
                          name="pincode"
                          placeholder="Pin code"
                          value={formDetail.pincode}
                          onBlur={(e) => handleBlur(e)}
                          onChange={(e) => handleChange(e, true)}
                          error={formDetail.pincodeError}
                        />
                      </div>
                    </div>
                    <div className="col-md-12">
                      <div className="form-group">
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
                    <div className="col-md-12">
                      <div className="form-group">
                        <Input
                          type="text"
                          name="country"
                          placeholder="Country"
                          disabled={true}
                          value={formDetail.country}
                          onBlur={(e) => handleBlur(e)}
                          onChange={(e) => handleChange(e, true)}
                          error={formDetail.countryError}
                        />
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className="joinbtn text-center mt-4">
            <button
              className="btn mb-5"
              onClick={() => {
                submitForm();
              }}
            >
              Update Profile
            </button>
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

export default connect(mapStateToProps)(EditProfile);
