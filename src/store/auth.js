import { SET_USER_DATA, SET_PART_USER_DATA } from '../actions/auth';
import { getUserData } from '../utils/functions';

const initialState = {
  userData: getUserData(),
};

const auth = (state = initialState, action) => {
  switch (action.type) {

    case SET_USER_DATA:
      return {
        ...state,
        userData: action.payload,
      };

    case SET_PART_USER_DATA:
      return {
        ...state,
        userData: {
          ...state.userData,
          ...action.payload,
        },
      };

    default:
      return state;
  }
};

export default auth;
