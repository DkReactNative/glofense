import Session from '../../helpers/session';
var intialState = Session.getSession('gloFenseUser');
intialState = {...intialState, ...{language: 'english'}};
export default (state = intialState, action) => {
  switch (action.type) {
    case 'login_user':
      Session.setSession('gloFenseUser', {...state, ...action.payload});
      return action.payload;
    case 'update_profile':
      Session.setSession('gloFenseUser', {...state, ...action.payload});
      return {...state, ...action.payload};
    case 'logout':
      Session.clearItem('gloFenseUser');
      state = {};
      return action.payload;
    default:
      return state;
  }
};
