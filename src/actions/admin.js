import { adminAPI } from '../api/admin';
import { actionWrapper } from './actionWrapper';
import { isFetching } from './preloader';

export const SET_USERS = 'SET_USERS';
export const UPDATE_USER_ROLE = 'UPDATE_USER_ROLE';
export const BAN_USER = 'BAN_USER';
export const UNBAN_USER = 'UNBAN_USER';

export const setUsers = ({ users, total, page }) => ({
  type: SET_USERS,
  payload: { users, total, page },
});

export const updateUserRole = (userId, newRole) => ({
  type: UPDATE_USER_ROLE,
  payload: { userId, newRole },
});

export const banUserAction = (userId) => ({
  type: BAN_USER,
  payload: userId,
});

export const unbanUserAction = (userId) => ({
  type: UNBAN_USER,
  payload: userId,
});

export const fetchUsers = (page, limit = 10, searchQuery) =>
  actionWrapper(async (dispatch) => {
    dispatch(isFetching(true));
    try {
      const { users, total } = await adminAPI.fetchUsers(page, limit, searchQuery); // Передаем searchQuery
      dispatch(setUsers({ users, total, page }));
    } catch (error) {
      console.error('Ошибка загрузки пользователей:', error);
    } finally {
      dispatch(isFetching(false));
    }
  });

export const changeUserRole = (userId, newRole) =>
  actionWrapper(async (dispatch) => {
    try {
      await adminAPI.changeUserRole(userId, newRole);
      dispatch(updateUserRole(userId, newRole));
    } catch (error) {
      console.error('Ошибка изменения роли пользователя:', error);
    }
  });

export const banUser = (userId) =>
  actionWrapper(async (dispatch) => {
    try {
      await adminAPI.banUser(userId);
      dispatch(banUserAction(userId));
    } catch (error) {
      console.error('Ошибка бана пользователя:', error);
    }
  });

export const unbanUser = (userId) =>
  actionWrapper(async (dispatch) => {
    try {
      await adminAPI.unbanUser(userId);
      dispatch(unbanUserAction(userId));
    } catch (error) {
      console.error('Ошибка разбана пользователя:', error);
    }
  });
