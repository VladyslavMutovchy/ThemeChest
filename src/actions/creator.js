export const SET_GUIDES = 'SET_GUIDES';
export const SET_PART_GUIDES = 'SET_PART_GUIDES';
export const ADD_GUIDE = 'ADD_GUIDE';
export const UPDATE_THEMES = 'UPDATE_THEMES';
export const SET_THEMES_BY_GUIDE = 'SET_THEMES_BY_GUIDE';

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
      const newGuide = await creatorAPI.createGuide(guideData); // Запрос к API для создания гайда
      dispatch(addGuide(newGuide));
      callback?.(newGuide); // Колбэк при успешном создании
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
    console.error('Failed to update guide themes:', error);
  }
};
export const getGuideThemes = (guide_id) => async (dispatch) => {
  try {
    const response = await creatorAPI.getGuideThemes(guide_id);
    dispatch(setThemesByGuide(guide_id, response.themes));
  } catch (error) {
    console.error('Failed to get guide themes:', error);
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
