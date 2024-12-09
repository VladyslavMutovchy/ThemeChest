import { get, post } from './api';

const BASE_URL = 'guides/';

export const guidesAPI = {
  fetchGuidesPaginated(url) {
    return get(url);
  },
  addToFavorites(guide_id, user_id) {
    return post(`${BASE_URL}addToFavorites`, { user_id, guide_id });
  },
  removeFromFavorites(guide_id, user_id) {
    return post(`${BASE_URL}removeFromFavorites`, { user_id, guide_id });
  },
  getFavorites(user_id) {
    return post(`${BASE_URL}getFavorites`, { user_id }); 
  },
};

