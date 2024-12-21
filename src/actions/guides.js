export const SET_ALL_GUIDES = 'SET_ALL_GUIDES';
export const CLEAR_GUIDES = 'CLEAR_GUIDES';
export const SET_FAVORITES = 'SET_FAVORITES';

import { actionWrapper } from './actionWrapper';
import { guidesAPI } from '../api/guides';

const BASE_URL = 'guides/';

export const fetchGuidesPaginated = (page, user_id, keywords = [], searchQuery = '', clearStore = false) =>
  actionWrapper(async (dispatch) => {
    try {
      if (clearStore) {
        dispatch(clearGuides());
      }
      let url = `${BASE_URL}fetchGuidesPaginated?page=${page}`;

      if (user_id > 0) {
        url += `&user_id=${encodeURIComponent(user_id)}`;
      }
      
      if (keywords.length > 0) {
        const keywordsParam = keywords.join(',');
        url += `&keywords=${encodeURIComponent(keywordsParam)}`;
      }

      if (searchQuery) {
        url += `&search=${encodeURIComponent(searchQuery)}`;
      }
      const guides = await guidesAPI.fetchGuidesPaginated(url);
      dispatch(setAllGuides(guides));
    } catch (error) {
      console.error('Failed to get guides:', error);
    }
  });
export const getFavorites = (user_id) =>
  actionWrapper(async (dispatch) => {
    try {
      const favorites = await guidesAPI.getFavorites(user_id);
      dispatch(setFavorites(favorites));
    } catch (error) {
      console.error('Failed to get favorites:', error);
    }
  });
export const addToFavorites = (guide_id, user_id) =>
  actionWrapper(async (dispatch) => {
    try {
      await guidesAPI.addToFavorites(guide_id, user_id);
      dispatch(getFavorites(user_id));
    } catch (error) {
      console.error('Failed to add to favorites:', error);
    }
  });

export const removeFromFavorites = (guide_id, user_id) =>
  actionWrapper(async (dispatch) => {
    try {
      await guidesAPI.removeFromFavorites(guide_id, user_id);
      dispatch(getFavorites(user_id));
    } catch (error) {
      console.error('Failed to remove from favorites:', error);
    }
  });

export const setAllGuides = (guides) => ({
  type: SET_ALL_GUIDES,
  payload: guides,
});
export const setFavorites = (favorites) => ({
  type: SET_FAVORITES,
  payload: favorites,
});
export const clearGuides = () => ({
  type: CLEAR_GUIDES,
});
