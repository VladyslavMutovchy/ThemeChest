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

export function toRoman(num) {
  const romanNumerals = [
    'I',
    'II',
    'III',
    'IV',
    'V',
    'VI',
    'VII',
    'VIII',
    'IX',
    'X',
    'XI',
    'XII',
    'XIII',
    'XIV',
    'XV',
    'XVI',
    'XVII',
    'XVIII',
    'XIX',
    'XX',
  ];

  return romanNumerals[num];
}

export const decodeJWT = (token) => {
  try {
    const payload = token.split('.')[1];
    const decoded = JSON.parse(atob(payload));
    return decoded;
  } catch (error) {
    console.error('Invalid token:', error);
    return null;
  }
};

export const isTokenExpired = (token) => {
  const decoded = decodeJWT(token);
  if (!decoded) return true;
  const currentTime = Math.floor(Date.now() / 1000);
  return decoded.exp < currentTime;
};

export const getRoleFromToken = (token) => {
  const decoded = decodeJWT(token);
  if (decoded?.roles && decoded.roles.length > 0) {
    return decoded.roles[0].id; 
  }
  return null;
};