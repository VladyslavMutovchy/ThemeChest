export const SET_ALL_GUIDES = 'SET_ALL_GUIDES';
export const CLEAR_GUIDES = 'CLEAR_GUIDES';


import { actionWrapper } from './actionWrapper';
import { guidesAPI } from '../api/guides';

const BASE_URL = 'guides/';

export const fetchGuidesPaginated = (page, keywords = [], searchQuery = '', clearStore = false) =>
  actionWrapper(async (dispatch) => {
    try {
      if (clearStore) {
        dispatch(clearGuides());
      }

      let url = `${BASE_URL}fetchGuidesPaginated?page=${page}`;

      if (keywords.length > 0) {
        const keywordsParam = keywords.join(',');
        url += `&keywords=${encodeURIComponent(keywordsParam)}`;
      }

      if (searchQuery) {
        url += `&search=${encodeURIComponent(searchQuery)}`;
      }

      const guides = await guidesAPI.fetchGuidesPaginated(url);
      console.log('action======>', guides);
      dispatch(setAllGuides(guides));
    } catch (error) {
      console.error('Failed to get guides:', error);
    }
  });



export const setAllGuides = (guides) => ({
  type: SET_ALL_GUIDES,
  payload: guides,
});


export const clearGuides = () => ({
  type: CLEAR_GUIDES,
});