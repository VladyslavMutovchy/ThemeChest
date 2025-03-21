import { postFile, get } from './api';

export const profileAPI = {
  updateProfile(userData) {
    return postFile(`profile/postUserProfile`, userData);
  },
  updatePassword(id, values) {
    return postFile(`profile/changePassword/${id}`, values);
  },
  fetchProfile(id) {
    return get(`profile/getUserData/${id}`);
  },
};
