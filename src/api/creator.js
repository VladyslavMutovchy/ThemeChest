import { postFile, get, post } from './api';

const BASE_URL = 'creator/';

export const creatorAPI = {
  updateProfile(userData) {
    return postFile(`${BASE_URL}postUserProfile`, userData);
  },
  createGuide(guideData) {
    return post(`${BASE_URL}createGuide`, guideData);
  },
  getGuidesData(userId) {
    return get(`${BASE_URL}getGuidesData/${userId}`); // Используем userId в качестве параметра
  },
};
