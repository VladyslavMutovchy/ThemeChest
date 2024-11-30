export const SET_ALL_GUIDES = 'SET_ALL_GUIDES';

import { actionWrapper } from './actionWrapper';
import { guidesAPI } from '../api/guides';

const BASE_URL = 'guides/';

export const fetchGuidesPaginated = (page, keywords = [], searchQuery = '') =>
  actionWrapper(async (dispatch) => {
    try {
      let url = `${BASE_URL}fetchGuidesPaginated?page=${page}`;

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

export const setAllGuides = (guides) => ({
  type: SET_ALL_GUIDES,
  payload: guides,
});
