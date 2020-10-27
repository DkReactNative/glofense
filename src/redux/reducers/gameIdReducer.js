import Session from '../../helpers/session';
var intialState2 = Session.getSession('game_id');
export default (state = intialState2, action) => {
  switch (action.type) {
    case 'update_game_id':
      return action.payload;
    default:
      return state;
  }
};
