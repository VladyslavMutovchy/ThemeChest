export const SET_ALL_GUIDES = 'SET_ALL_GUIDES';


import { actionWrapper } from './actionWrapper';
import { guidesAPI } from '../api/guides';
import { isFetching } from './preloader';

export const fetchGuidesPaginated = (page) =>
  actionWrapper(async (dispatch) => {
    dispatch(isFetching(true));
    try {
      const guides = await guidesAPI.fetchGuidesPaginated(page);
      dispatch(setAllGuides(guides)); 
    } catch (error) {
      console.error('Failed to get guides:', error);
    } finally {
      dispatch(isFetching(false));
    }
  });


// export const getGuideThemes = (guide_id) => async (dispatch) => {
//   try {
//     const response = await guidesAPI.getGuideThemes(guide_id);
//     dispatch(setThemesByGuide(guide_id, response.themes));
//   } catch (error) {
//     console.error('Failed to get guide Themes:', error);
//   }
// };

// export const getGuideChapters = (guide_id) => async (dispatch) => {
//   dispatch(resetChapters());

//   try {
//     const response = await guidesAPI.getGuideChapters(guide_id);
//     console.log('===Данные с сервера===>', response);
//     dispatch(updateChapters(response.guide_id, response.chapters));
//   } catch (error) {
//     console.error('Failed to get guide Chapters:', error);
//   }
// };

export const setAllGuides = (guides) => ({
  type: SET_ALL_GUIDES,
  payload: guides,
});


