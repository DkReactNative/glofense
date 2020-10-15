export default (state = true, action) => {
  switch (action.type) {
    case 'reload_browser':
      return action.payload;
    default:
      return state;
  }
};
