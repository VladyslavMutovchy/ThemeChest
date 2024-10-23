import { applyMiddleware, combineReducers, createStore } from 'redux';
import thunk from 'redux-thunk';

import auth from './auth';
import preloader from './preloader';

const USER_LOGOUT = 'USER_LOGOUT';

// Убираем редюсер формы
const allReducers = combineReducers({
  auth,
  preloader,
});

const rootReducer = (state, action) => {
  if (action.type === USER_LOGOUT) {
    // remove user from local storage to log user out
    localStorage.removeItem('user');
    state = undefined;
  }

  return allReducers(state, action);
};

let middleware = [thunk];

export default createStore(rootReducer, applyMiddleware(...middleware));
