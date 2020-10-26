export default (state = {}, action) => {
  switch (action.type) {
    case 'update_invite_match_detail':
      return action.payload;
    default:
      return state;
  }
};
