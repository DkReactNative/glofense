const intialState = false;
export default (state = intialState, action) => {
  switch (action.type) {
    case 'login_form':
      return action.payload;
    default:
      return state;
  }
};
