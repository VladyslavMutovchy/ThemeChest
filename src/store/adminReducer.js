import { SET_USERS, UPDATE_USER_ROLE, BAN_USER, UNBAN_USER } from '../actions/admin';

const initialState = {
  users: [],
  total: 0,
  page: 1,
};

const adminReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_USERS:
      return {
        ...state,
        users: action.payload.page === 1 ? action.payload.users : [...state.users, ...action.payload.users],
        total: action.payload.total,
        page: action.payload.page,
      };

    case UPDATE_USER_ROLE:
      return {
        ...state,
        users: state.users.map((user) => (user.id === action.payload.userId ? { ...user, role: action.payload.newRole } : user)),
      };

    case BAN_USER:
      return {
        ...state,
        users: state.users.map((user) => (user.id === action.payload ? { ...user, isBanned: true } : user)),
      };

    case UNBAN_USER:
      return {
        ...state,
        users: state.users.map((user) => (user.id === action.payload ? { ...user, isBanned: false } : user)),
      };

    default:
      return state;
  }
};

export default adminReducer;
