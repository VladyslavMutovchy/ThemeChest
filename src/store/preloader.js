import { IS_FETCHING } from '../actions/preloader';

let initialState = {
  isFetching: false,
};

const preloader = (state = initialState, action) => {
  switch (action.type) {
    case IS_FETCHING:
      return {
        ...state,
        isFetching: action.isFetching,
      };

    default:
      return state;
  }
};

export default preloader;
