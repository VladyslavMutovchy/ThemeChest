import { SET_ALL_GUIDES, CLEAR_GUIDES, SET_FAVORITES } from '../actions/guides';

const initialState = {
  guidesListPaginated: {
    data: [],
    total: 0,
  },
  favorites: [],
};

const guidesReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_ALL_GUIDES: {
      const existingIds = new Set(state.guidesListPaginated.data.map((guide) => guide.id));
      const newGuides = (action.payload.data || []).filter((guide) => !existingIds.has(guide.id));

      return {
        ...state,
        guidesListPaginated: {
          data: [...state.guidesListPaginated.data, ...newGuides],
          total: action.payload.total || state.guidesListPaginated.total,
        },
      };
    }

    case CLEAR_GUIDES:
      return {
        ...state,
        guidesListPaginated: {
          data: [],
          total: 0,
        },
      };

    case SET_FAVORITES:
      return {
        ...state,
        favorites: action.payload || [], // Сохраняем переданные избранные элементы
      };

    default:
      return state;
  }
};

export default guidesReducer;
