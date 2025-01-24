import { post } from './api';

const BASE_URL = 'creator/';

export const aiCreatorAPI = {
  aiCreateGuide(guideData) {
    console.log('======>', guideData);
    return post(`${BASE_URL}generateAiGuide`, guideData);
  },
};
