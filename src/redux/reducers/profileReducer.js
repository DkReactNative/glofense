import Session from '../../helpers/session';
const intialState = Session.getSession('gloFenseUser');
export default (state = intialState, action) => {
  switch (action.type) {
    case 'login_user':
      return action.payload;
    case 'logout':
        return action.payload;
    default:
      return state;
  }
};
