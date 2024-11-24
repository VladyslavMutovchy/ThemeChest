import { get, post, postFile } from './api';

const BASE_URL = 'guides/';

export const guidesAPI = {
  fetchGuidesPaginated(page) {
    return get(`${BASE_URL}fetchGuidesPaginated?page=${page}`);
  },

  // getGuideThemes(guide_id) {
  //   return get(`${BASE_URL}getGuideThemes/${guide_id}`);
  // },

  // getGuideChapters(guide_id) {
  //   return get(`${BASE_URL}getGuideChapters/${guide_id}`);
  // },
};
