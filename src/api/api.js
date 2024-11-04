import axios from 'axios';
import { backURL } from '../config';

const authHeader = () => {
  const token = JSON.parse(localStorage.getItem('user'))?.token;
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const axiosInstance = axios.create({
  baseURL: backURL,
  crossDomain: true,
});

axiosInstance.interceptors.request.use((config) => {
  config.headers = { ...config.headers, ...authHeader() }; // Добавляем заголовок с токеном
  return config;
}, (error) => Promise.reject(error));

// Создаем экземпляр axios для работы с файлами
const axiosFileInstance = axios.create({
  baseURL: backURL,
  crossDomain: true,
});

axiosFileInstance.interceptors.request.use((config) => {
  config.headers = { ...config.headers, ...authHeader() }; // Добавляем заголовок с токеном для файлов
  return config;
}, (error) => Promise.reject(error));

// Определяем методы для запросов
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

  const callback = args[index++];
  const errorCallback = args[index];

  const response = await axiosInstance.get(url).then(callback).catch(errorCallback);
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
