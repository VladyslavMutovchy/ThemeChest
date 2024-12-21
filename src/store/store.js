import { applyMiddleware, combineReducers, createStore } from 'redux';
import thunk from 'redux-thunk';

import auth from './auth';
import preloader from './preloader';
import creatorReducer from './creatorReducer';
import guidesReducer from './guidesReducer';
import adminReducer from './adminReducer';

const USER_LOGOUT = 'USER_LOGOUT';

const allReducers = combineReducers({
  auth,
  preloader,
  creatorReducer,
  guidesReducer,
  adminReducer,
});

const rootReducer = (state, action) => {
  if (action.type === USER_LOGOUT) {
    localStorage.removeItem('user');
    state = undefined;
  }

  return allReducers(state, action);
};

let middleware = [thunk];

export default createStore(rootReducer, applyMiddleware(...middleware));
