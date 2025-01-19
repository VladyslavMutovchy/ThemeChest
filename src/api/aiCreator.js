import { post } from './api';

const BASE_URL = 'aiCreator/';

export const aiCreatorAPI = {
  aiCreateGuide(guideData) {
    return post(`${BASE_URL}aiCreateGuide`, guideData);
  },
};
