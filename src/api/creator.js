import { get, post } from './api';

const BASE_URL = 'creator/';

export const creatorAPI = {


  updateGuideThemes(themeData) {
    return post(`${BASE_URL}updateGuideThemes`, themeData);
  },
  getGuideThemes(guide_id) {
    return get(`${BASE_URL}getGuideThemes/${guide_id}`); 
  },




  createGuide(guideData) {
    return post(`${BASE_URL}createGuide`, guideData);
  },
  getGuidesData(userId) {
    return get(`${BASE_URL}getGuidesData/${userId}`); 
  },
};
