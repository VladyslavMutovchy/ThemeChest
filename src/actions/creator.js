// actions/creator.js

export const SET_GUIDES = 'SET_GUIDES';
export const SET_PART_GUIDES = 'SET_PART_GUIDES';
export const ADD_GUIDE = 'ADD_GUIDE';

import { actionWrapper } from './actionWrapper';
import { creatorAPI } from '../api/creator';
import { isFetching } from './preloader';

// Экшон для получения всех гайдов
export const getGuidesData = () =>
  actionWrapper(async (dispatch) => {
    dispatch(isFetching(true));
    try {
      const guides = await creatorAPI.getGuidesData(); // Запрос к API для получения всех гайдов
      dispatch(setGuides(guides));
    } catch (error) {
      console.error('Failed to get guides:', error);
    } finally {
      dispatch(isFetching(false));
    }
  });

// Экшон для создания гайда
export const createGuide = (guideData, callback) =>
  actionWrapper(async (dispatch) => {
    dispatch(isFetching(true));
    try {console.log('======>', guideData);
      const newGuide = await creatorAPI.createGuide(guideData); // Запрос к API для создания гайда
      dispatch(addGuide(newGuide));
      callback?.(newGuide); // Колбэк при успешном создании
    } catch (error) {
      console.error('Failed to create guide:', error);
    } finally {
      dispatch(isFetching(false));
    }
  });

// Остальные экшоны для сеттинга данных
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
