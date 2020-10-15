import Session from '../../helpers/session';
var intialState = Session.getSession('gloFenseUser');
intialState = {...intialState, ...{language: 'english'}};
export default (state = intialState, action) => {
  if (action.type !== 'logout' && action.payload && action.payload != null) {
    Session.setSession('gloFenseUser', {...state, ...action.payload});
  } else if(action.type === 'logout') {
    Session.clearItem('gloFenseUser');
    state = {};
  }
  switch (action.type) {
    case 'login_user':
      return action.payload;
    case 'update_profile':
      return {...state, ...action.payload};
    case 'logout':
      return action.payload;
    default:
      return state;
  }
};
