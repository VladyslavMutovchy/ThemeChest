import { SET_ALL_GUIDES } from '../actions/guides';

const initialState = {
  guidesListPaginated: {
    data: [],
    total: 0, 
  },
};

const guidesReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_ALL_GUIDES:
      return {
        ...state,
        guidesListPaginated: {
          data: action.payload.data || [],
          total: action.payload.total || 0,
        },
      };

    default:
      return state;
  }
};

export default guidesReducer;
