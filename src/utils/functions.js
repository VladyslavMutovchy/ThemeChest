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

export function base64ToFile(base64Value, mimeType, fileName) {
 
  const byteString = atob(base64Value);
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);

  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }

  return new File([ab], fileName, { type: mimeType });
}


