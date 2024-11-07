import { profileAPI } from '../api/profile.js';
import { actionWrapper } from './actionWrapper.js';
import { isFetching } from './preloader.js';

export const SET_USER_DATA = 'SET_USER_DATA';
export const SET_FORM_ERROR = 'SET_FORM_ERROR';
export const SAVE_DATA = 'SAVE_DATA';
export const GET_DATA = 'GET_DATA';

export const SET_ERROR = 'SET_ERROR';

export const setError = (hasError) => ({
  type: SET_ERROR,
  payload: hasError,
});

export const updateUserProfile = (userData, callback, errorCallback) =>
  actionWrapper(async (dispatch) => {
    dispatch(isFetching(true));
    try {
      const newUserData = await profileAPI.updateProfile(userData);
      dispatch(setUserData(newUserData)); 
      callback?.(newUserData); 
    } catch (error) {
      errorCallback?.(error);
    } finally {
      dispatch(isFetching(false));
    }
  });

export const changePasswordAction = (id, values, callback, errorCallback) =>
  actionWrapper(async (dispatch) => {
    dispatch(isFetching(true));
    try {
      await profileAPI.updatePassword(id, values);
      callback?.();
    } catch (error) {
      errorCallback?.(error);
    } finally {
      dispatch(isFetching(false));
    }
  });

export const getUserData = (id, callback, errorCallback) =>
  actionWrapper(async (dispatch) => {
    dispatch(isFetching(true));
    try {
      const userData = await profileAPI.fetchProfile(id);
      if (userData.photo && userData.mimeType) {
        userData.photoUrl = `data:${userData.mimeType};base64,${userData.photo}`; 
      }
      dispatch(setUserData(userData));
      callback?.();
    } catch (error) {
      errorCallback?.(error);
    } finally {
      dispatch(isFetching(false));
    }
  });

export const setUserData = (profile) => {
  return {
    type: SET_USER_DATA,
    payload: profile,
  };
};
