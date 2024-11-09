import { UPDATE_THEMES, SET_GUIDES, SET_PART_GUIDES, ADD_GUIDE, SET_THEMES_BY_GUIDE } from '../actions/creator';

const initialState = {
  guidesList: [],
  themesByGuide: {},
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
        guidesList: state.guidesList.map((guide) => (guide.id === action.payload.id ? { ...guide, ...action.payload } : guide)),
      };

    case ADD_GUIDE:
      return {
        ...state,
        guidesList: [...state.guidesList, action.payload],
      };

    case UPDATE_THEMES:
      return {
        ...state,
        themesByGuide: {
          ...state.themesByGuide,
          [action.payload.guide_id]: action.payload.themes,
        },
      };

    case SET_THEMES_BY_GUIDE:
      return {
        ...state,
        themesByGuide: {
          ...state.themesByGuide,
          [action.payload.guide_id]: action.payload.themes,
        },
      };

    default:
      return state;
  }
};

export default creatorReducer;
