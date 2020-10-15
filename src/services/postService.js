import axios from 'axios';
//const URL = 'http://192.168.1.45:6061/api/users/';
//const URL = 'http://13.235.72.118:6061/api/users/';
import Session from '../helpers/session';
var JWTToken = Session.getSession('gloFenseUser');
JWTToken = JWTToken ? JWTToken.token : '';
export const postService = (urlAction, params, token = JWTToken) => {
  let ServiceUrl = process.env.REACT_APP_API_BASE_URL+"api/users/" + urlAction;
  return axios({
    method: 'post',
    url: ServiceUrl,
    data: params,
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': token ? token : '',
    },
  });
};
