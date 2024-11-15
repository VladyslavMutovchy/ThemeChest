export const SET_GUIDES = 'SET_GUIDES';
export const SET_PART_GUIDES = 'SET_PART_GUIDES';
export const ADD_GUIDE = 'ADD_GUIDE';
export const UPDATE_THEMES = 'UPDATE_THEMES';
export const SET_THEMES_BY_GUIDE = 'SET_THEMES_BY_GUIDE';
export const SET_CHAPTERS_BY_GUIDE = 'SET_CHAPTERS_BY_GUIDE';
export const UPDATE_CHAPTERS = 'UPDATE_CHAPTERS';

import { actionWrapper } from './actionWrapper';
import { creatorAPI } from '../api/creator';
import { isFetching } from './preloader';

export const getGuidesData = (userId) =>
  actionWrapper(async (dispatch) => {
    dispatch(isFetching(true));
    try {
      const guides = await creatorAPI.getGuidesData(userId);
      dispatch(setGuides(guides));
    } catch (error) {
      console.error('Failed to get guides:', error);
    } finally {
      dispatch(isFetching(false));
    }
  });

export const createGuide = (guideData, callback) =>
  actionWrapper(async (dispatch) => {
    dispatch(isFetching(true));
    try {
      const newGuide = await creatorAPI.createGuide(guideData);
      dispatch(addGuide(newGuide));
      callback?.(newGuide);
    } catch (error) {
      console.error('Failed to create guide:', error);
    } finally {
      dispatch(isFetching(false));
    }
  });

export const updateGuideThemes = (guide_id, themeData, callback) => async (dispatch) => {
  try {
    const response = await creatorAPI.updateGuideThemes({ guide_id, ...themeData });
    dispatch(updateThemes(guide_id, response.themes));
    if (callback) callback(response);
  } catch (error) {
    console.error('Failed to update guide Themes:', error);
  }
};
export const getGuideThemes = (guide_id) => async (dispatch) => {
  try {
    const response = await creatorAPI.getGuideThemes(guide_id);
    dispatch(setThemesByGuide(guide_id, response.themes));
  } catch (error) {
    console.error('Failed to get guide Themes:', error);
  }
};

export const updateGuideChapters = ( chapterData, callback) => async (dispatch) => {
  console.log('Dispatching updateGuideChapters:', chapterData); 
  try {
    const response = await creatorAPI.updateGuideChapters(chapterData );
    dispatch(updateChapters(response.chapters));
    if (callback) callback(response);
  } catch (error) {
    console.error('Failed to update guide Chapters:', error);
  }
};

export const getGuideChapters = (guide_id) => async (dispatch) => {
  try {
    const response = await creatorAPI.getGuideChapters(guide_id);
    console.log('===Данные с сервера===>', response);
    dispatch(updateChapters(guide_id, response.chapters));
  } catch (error) {
    console.error('Failed to get guide Chapters:', error);
  }
};

export const setGuides = (guides) => ({
  type: SET_GUIDES,
  payload: guides,
});

export const addGuide = (guide) => ({
  type: ADD_GUIDE,
  payload: guide,
});

export const setPartGuides = (guide) => ({
  type: SET_PART_GUIDES,
  payload: guide,
});

export const updateThemes = (guide_id, themes) => ({
  type: UPDATE_THEMES,
  payload: { guide_id, themes },
});
export const setThemesByGuide = (guide_id, themes) => ({
  type: SET_THEMES_BY_GUIDE,
  payload: { guide_id, themes },
});

export const setChaptersByGuide = (guide_id, chapters) => ({
  type: SET_CHAPTERS_BY_GUIDE,
  payload: { guide_id, chapters },
});

export const updateChapters = (guide_id, chapters) => ({
  type: UPDATE_CHAPTERS,
  payload: { guide_id, chapters },
});

