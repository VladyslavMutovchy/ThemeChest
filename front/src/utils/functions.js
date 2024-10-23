import config from '../config';

export const getFieldFromURLParams = (field) => {
  const params = new URLSearchParams(window.location.search);
  return params.get(field);
};

export const getUserData = () => {
  const userData = localStorage.getItem('user');

  if (userData) {
    return JSON.parse(userData);
  }

  return null;
};

export const setUserData = (userData) => {
  localStorage.setItem('user', JSON.stringify(userData));
};


export const updateUserData = (userData) => {
  const oldUserData = getUserData();
  const newUserData = {
    ...oldUserData,
    ...userData,
  };
  setUserData(newUserData);
};

export const backendFileURL = (path) => {
  if (path && path.indexOf('http') !== 0) {
    return `${config.backFileURL}${path}`;
  }

  return path;
};
