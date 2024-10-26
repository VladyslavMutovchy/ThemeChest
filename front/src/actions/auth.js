import { authAPI } from '../api/auth';
import { setUserData, updateUserData } from '../utils/functions';
import { actionWrapper } from './actionWrapper';


export const SET_USER_DATA = 'SET_USER_DATA';
export const SET_PART_USER_DATA = 'SET_PART_USER_DATA';
export const SET_FORM_ERROR = 'SET_FORM_ERROR'; 

const loginProceed = (userData) => {
  setUserData(userData);
  return {
    type: SET_USER_DATA,
    payload: userData,
  };
};

export const setFormError = (formName, error) => ({
  type: SET_FORM_ERROR,
  payload: { formName, error },
});

// Регистрация
export const registration = (registrationData, callback) => actionWrapper(async (dispatch) => {
  const authData = await authAPI.registration(registrationData);
  callback?.();
  return loginProceed(authData);
}, (error, dispatch) => {
  dispatch(setFormError('registration_form', error));
});

export const login = (loginData, callback) => actionWrapper(async (dispatch) => {
  const authData = await authAPI.login(loginData);
  callback?.();
  return loginProceed(authData);
}, (error, dispatch) => {
  dispatch(setFormError('login_form', error));
});

export const googleAuth = (code, callback, errorCallback) => actionWrapper(async (dispatch) => {
  const authData = await authAPI.googleAuth(code);
  callback?.();
  return loginProceed(authData);
}, errorCallback);

export const facebookAuth = (code, callback, errorCallback) => actionWrapper(async (dispatch) => {
  const authData = await authAPI.facebookAuth(code);
  callback?.();
  return loginProceed(authData);
}, errorCallback);


export const logout = () => (dispatch) => {
  localStorage.removeItem('user'); 
  dispatch({
    type: SET_USER_DATA,
    payload: null,
  });
  window.location.reload();
};

export const setPartUserData = (profile) => {
  updateUserData(profile);

  return {
    type: SET_PART_USER_DATA,
    payload: profile,
  };
};
