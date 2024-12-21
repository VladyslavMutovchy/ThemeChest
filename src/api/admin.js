import { get, put } from './api';

const BASE_URL = 'admin-list/';

export const adminAPI = {
  fetchUsers(page, limit = 20, searchQuery) {
    const query = `page=${page}&limit=${limit}${searchQuery ? `&search=${encodeURIComponent(searchQuery)}` : ''}`;
    return get(`${BASE_URL}users?${query}`);
  },
  

  changeUserRole(userId, newRole) {
    return put(`${BASE_URL}users/${userId}/role`, { role: newRole });
  },

  banUser(userId) {
    return put(`${BASE_URL}users/${userId}/ban`, {});
  },

  unbanUser(userId) {
    return put(`${BASE_URL}users/${userId}/unban`, {});
  },
};
