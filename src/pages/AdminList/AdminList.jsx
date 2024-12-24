import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { changeUserRole, banUser, unbanUser, fetchUsers } from '../../actions/admin';
import styles from './AdminList.module.css';
import { getRoleFromToken } from '../../utils/functions';

const AdminList = ({ userData, users, total, fetchUsers, changeUserRole, banUser, unbanUser }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [role, setRole] = useState(null);

  const roles = ['user', 'creator', 'moderator', 'admin'];

  useEffect(() => {
    if (userData?.token) {
      const roleId = getRoleFromToken(userData.token);
      setRole(roleId);
    }
  }, [userData]);

  useEffect(() => {
    if (userData && role === 1) {
      loadUsers(1, true);
    }
  }, [userData, role]);

  const loadUsers = async (pageNumber, reset = false, searchQuery = '') => {
    setLoading(true);
    try {
      await fetchUsers(pageNumber, 10, searchQuery);
      if (reset) {
        setPage(1);
      } else {
        setPage(pageNumber);
      }
    } catch (error) {
      console.error('Ошибка загрузки пользователей:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    loadUsers(1, true, searchQuery);
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await changeUserRole(userId, newRole);
      loadUsers(page, true, searchQuery);
    } catch (error) {
      console.error('Ошибка изменения роли пользователя:', error);
    }
  };

  const handleBanToggle = async (userId, isBanned) => {
    try {
      if (isBanned) {
        await unbanUser(userId);
      } else {
        await banUser(userId);
      }
      loadUsers(page, true, searchQuery);
    } catch (error) {
      console.error('Ошибка смены статуса бана пользователя:', error);
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.admin_panel}>
        <h2>Admin Panel</h2>
        <div className={styles.search_container}>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Search by email or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className={styles.searchBtn} onClick={handleSearch}>
            Search
          </button>
        </div>
        <div className={styles.userList}>
          {users.map((user) => (
            <div key={user.id} className={styles.userCard}>
              <div className={styles.left}>
                <p>
                  <strong>ID:</strong> {user.id}
                </p>
                <p>
                  <strong>Email:</strong> {user.email}
                </p>
                <p>
                  <strong>Role:</strong> {user.roles?.map((role) => role.value).join(', ') || 'No roles assigned'}
                </p>
              </div>
              <div className={styles.right}>
                <button
                  onClick={() => handleBanToggle(user.id, user.banned)}
                  className={styles.banBtn}
                  disabled={user.roles?.some((role) => role.value === 'admin') && userData?.email === user.email}
                >
                  {user.banned ? 'Unban' : 'Ban'}
                </button>
                <select
                  value={user.roles[0]?.value || 'user'}
                  onChange={(e) => handleRoleChange(user.id, e.target.value)}
                  className={styles.roleSelect}
                  disabled={user.roles?.some((role) => role.value === 'admin') && userData?.email === user.email}
                >
                  {roles.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ))}
        </div>

        {!loading && users.length < total && (
          <button className={styles.load_more_btn} onClick={() => loadUsers(page + 1, false, searchQuery)}>
            Load More
          </button>
        )}
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  userData: state.auth.userData,
  users: state.adminReducer.users || [],
  total: state.adminReducer.total || 0,
});

const mapDispatchToProps = {
  fetchUsers,
  changeUserRole,
  banUser,
  unbanUser,
};

export default connect(mapStateToProps, mapDispatchToProps)(AdminList);
