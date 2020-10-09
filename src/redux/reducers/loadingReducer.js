const intialState = {};
export default (state = intialState, action) => {
  switch (action.type) {
    case 'loading':
      return action.payload;
    default:
      return state;
  }
};
