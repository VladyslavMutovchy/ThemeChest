import { profileAPI } from '../api/profile.js';
import { actionWrapper } from './actionWrapper';
import { isFetching } from './preloader'; 

export const SET_USER_DATA = 'SET_USER_DATA';
export const SET_FORM_ERROR = 'SET_FORM_ERROR';
export const SAVE_DATA = 'SAVE_DATA';  
export const GET_DATA = 'GET_DATA'; 

export const setFormError = (formName, error) => ({
  type: SET_FORM_ERROR,
  payload: { formName, error },
});

export const updateUserProfile = (userData, callback, errorCallback) => actionWrapper(async (dispatch) => {
  dispatch(isFetching(true)); 
  try {
    const newUserData = await profileAPI.updateProfile(userData);
    callback?.();
    dispatch(setUserData(newUserData)); 
  } catch (error) {
    errorCallback?.(error);
  } finally {
    dispatch(isFetching(false)); 
  }
});

export const saveValue = (userData) => {
  return async (dispatch) => {
    try {
      const formData = new FormData();
      _.forEach(userData, (value, field) => {
        if (field === 'awards' && value) {
          value.forEach((awardData, index) => {
            formData.append(`award[${index}].name`, awardData.name);
            formData.append(`award[${index}].logo`, awardData.logo);
          });
          return;
        }
        formData.append(field, value);
      });

      const newUserData = await editProfileAPI.update(formData);
      
      console.log('===newUserData', newUserData);
      dispatch(getData());
    } catch (e) {
      console.log('Error saving data', e);
    }
  };
};

export const changePasswordAction = (newPassword, callback, errorCallback) => actionWrapper(async (dispatch) => {
  dispatch(isFetching(true)); 
  try {
    const newUserData = await profileAPI.updatePassword(newPassword);
    callback?.();
    dispatch(setUserData(newUserData)); 
  } catch (error) {
    errorCallback?.(error);
  } finally {
    dispatch(isFetching(false));  
  }
});

export const getUserData = (callback, errorCallback) => actionWrapper(async (dispatch) => {
  dispatch(isFetching(true));  
  try {
    const userData = await profileAPI.fetchProfile();
    callback?.();
    dispatch(setUserData(userData)); 
  } catch (error) {
    errorCallback?.(error);
  } finally {
    dispatch(isFetching(false));  
  }
});


export const saveData = (userProfile) => {
  return async (dispatch) => {
    dispatch(isFetching(true));  
    try {
      const newUserProfile = await profileAPI.add(userProfile); 
      dispatch({ type: SAVE_DATA, payload: newUserProfile });
    } catch (error) {
      console.log('Ошибка при сохранении данных', error);
    } finally {
      dispatch(isFetching(false));  
    }
  };
};


export const getData = () => {
  return async (dispatch) => {
    dispatch(isFetching(true));  
    try {
      const userProfiles = await profileAPI.getAll(); 
      dispatch({
        type: GET_DATA,
        payload: [...userProfiles],
      });
    } catch (error) {
      console.log('Ошибка при получении данных', error);
    } finally {
      dispatch(isFetching(false)); 
    }
  };
};

export const setUserData = (profile) => {
  return {
    type: SET_USER_DATA,
    payload: profile,
  };
};
