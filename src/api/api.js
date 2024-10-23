import axios from 'axios';

import { backURL } from '../config';

const authHeader = (json = false) => {
  const contentType = json ? 'application/json' : 'application/x-www-form-urlencoded';
  const headers = { 'content-type': contentType };

  const user = JSON.parse(localStorage.getItem('user'));

  if (user?.token) {
    headers['x-solt'] = user.token;
  }

  return headers;
};

const addInterceptors = (instance, json) => {
  instance.interceptors.request.use((config) => {
    if (!config.headers['x-solt']) {
      config.headers = authHeader(json);
    }
    return config;
  }, Promise.reject);
};

const axiosInstance = axios.create({
  async: true,
  crossDomain: true,
  baseURL: backURL,
  headers: authHeader(true),
});

addInterceptors(axiosInstance, true);

const axiosFileInstance = axios.create({
  async: true,
  crossDomain: true,
  baseURL: backURL,
  headers: authHeader(),
  processData: false,
  contentType: false,
  mimeType: 'multipart/form-data',
});

addInterceptors(axiosFileInstance);

const post = async (url, data, callback, errorCallback) => {
  const response = await axiosInstance.post(url, JSON.stringify(data)).then(callback).catch(errorCallback);
  return response.data;
};

const put = async (url, data, callback, errorCallback) => {
  const response = await axiosInstance.put(url, JSON.stringify(data)).then(callback).catch(errorCallback);
  return response.data;
};

const deleteById = async (url, ...args) => {
  let index = typeof args[0] === 'function' ? -1 : 0;

  const id = args[index++];
  const callback = args[index++];
  const errorCallback = args[index];
  
  const response = await axiosInstance.delete(`${url}/${id}`).then(callback).catch(errorCallback);
  return response.data;
};

const get = async (url, ...args) => {
  let index = typeof args[0] === 'function' ? -1 : 0;

  const data = args[index++];
  const callback = args[index++];
  const errorCallback = args[index];

  const response = await axiosInstance.get(url, data).then(callback).catch(errorCallback);
  return response.data;
};

const postFile = (url, data, callback, errorCallback) => {
  return axiosFileInstance.post(url, data).then(callback).catch(errorCallback);
};

const putFile = (url, data, callback, errorCallback) => {
  return axiosFileInstance.put(url, data).then(callback).catch(errorCallback);
};

export {
  post,
  put,
  get,
  deleteById,
  postFile,
  putFile,
};
