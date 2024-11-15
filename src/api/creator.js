import { get, post, postFile } from './api';

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



  
  updateGuideChapters(chapterData) {
    return postFile(`${BASE_URL}updateGuideChapters`, chapterData);
  },
  
  getGuideChapters(guide_id) {
    return get(`${BASE_URL}getGuideChapters/${guide_id}`); 
  },

};
