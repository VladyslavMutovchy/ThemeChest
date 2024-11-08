import { SET_GUIDES, SET_PART_GUIDES, ADD_GUIDE } from '../actions/creator';

const initialState = {
  guidesList: [], 
};

const creatorReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_GUIDES:
      return {
        ...state,
        guidesList: action.payload, 
      };

    case SET_PART_GUIDES:  
      return {
        ...state,
        guidesList: state.guidesList.map((guide) =>
          guide.id === action.payload.id ? { ...guide, ...action.payload } : guide
        ), 
      };

    case ADD_GUIDE:
      return {
        ...state,
        guidesList: [...state.guidesList, action.payload], 
      };

    default:
      return state;
  }
};

export default creatorReducer;
