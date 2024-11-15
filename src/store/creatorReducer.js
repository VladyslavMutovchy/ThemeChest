import { SET_GUIDES, ADD_GUIDE, UPDATE_THEMES, SET_THEMES_BY_GUIDE, SET_CHAPTERS_BY_GUIDE, UPDATE_CHAPTERS } from '../actions/creator';

const initialState = {
  guidesList: [],
  themesByGuide: {},
  chaptersByGuide: {},
};

const creatorReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_GUIDES:
      return {
        ...state,
        guidesList: action.payload,
      };
    case ADD_GUIDE:
      return {
        ...state,
        guidesList: [...state.guidesList, action.payload],
      };
    case SET_THEMES_BY_GUIDE:
      return {
        ...state,
        themesByGuide: {
          ...state.themesByGuide,
          [action.payload.guide_id]: action.payload.themes,
        },
      };
    case UPDATE_THEMES:
      return {
        ...state,
        themesByGuide: {
          ...state.themesByGuide,
          [action.payload.guide_id]: action.payload.themes,
        },
      };
    case SET_CHAPTERS_BY_GUIDE:
      return {
        ...state,
        chaptersByGuide: {
          ...state.chaptersByGuide,
          [action.payload.guide_id]: action.payload.chapters,
        },
      };
    case UPDATE_CHAPTERS:
      return {
        ...state,
        chaptersByGuide: {
          ...state.chaptersByGuide,
          [action.payload.guide_id]: action.payload.chapters,
        },
      };
    default:
      return state;
  }
};

export default creatorReducer;
