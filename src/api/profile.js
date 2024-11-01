import { post, put, get } from './api';

export const profileAPI = {
  updateProfile(userData) {
    return post('profile/postUserProfile', userData);
  },
  updatePassword(newPassword) {
    return put('profile/changePassword', newPassword);
  },
  fetchProfile(id) {
    return get('profile/getUserData', id);
  },
};
