import axios from 'axios';
/******** MUTLIPART FORM DATA ********/
import Session from '../helpers/session';
var JWTToken = Session.getSession('gloFenseUser');
JWTToken = JWTToken ? JWTToken.token : '';
export default function uploadImageWithData(url, formData, token = null) {
  if (!token) {
    var JWTToken = Session.getSession('gloFenseUser');
    token = JWTToken ? JWTToken.token : '';
  }
  return new Promise((resolve, reject) => {
    axios({
      method: 'post',
      url: process.env.REACT_APP_API_BASE_URL + 'api/users/' + url,
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
        'x-access-token': token ? token : '',
      },
    })
      .then((response) => {
        resolve(response);
      })
      .catch((err) => {
        reject(err);
      });
  });
}
