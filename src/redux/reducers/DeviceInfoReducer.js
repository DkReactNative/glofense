const intialState = {};

export default (state = intialState, action) => {
  switch (action.type) {
    case 'update':
      return action.payload;
    default:
      return state;
  }
};
