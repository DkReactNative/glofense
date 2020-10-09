export default (state = null, action) => {
  switch (action.type) {
    case 'store_quiz':
      return action.payload;
    case 'update_quiz':
        return action.payload;
    default:
      return state;
  }
};
