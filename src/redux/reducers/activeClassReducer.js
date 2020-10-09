const intialState = {};
export default (state = intialState, action) => {
  switch (action.type) {
    case 'active_link':
      return action.payload;
    default:
      return state;
  }
};
