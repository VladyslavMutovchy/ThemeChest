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
    if (newRole === 'admin' && users.some((user) => user.role === 'admin')) {
      alert('Только один пользователь может иметь роль admin.');
      return;
    }
    try {
      await changeUserRole(userId, newRole);
      loadUsers(1, true, searchQuery);
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
      loadUsers(1, true, searchQuery);
    } catch (error) {
      console.error('Ошибка смены статуса бана пользователя:', error);
    }
  };

  if (!userData || role !== 1) {
    return <p>У вас нет доступа к этой странице.</p>;
  }

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
        {loading ? (
          <p className={styles.loading}>Loading...</p>
        ) : (
          <div className={styles.userList}>
            {users.map((user) => (
              <div key={user.id} className={styles.userCard}>
                <p>
                  <strong>ID:</strong> {user.id}
                </p>
                <p>
                  <strong>Email:</strong> {user.email}
                </p>
                <p>
                  <strong>Role:</strong> {user.role}
                </p>
                <button onClick={() => handleBanToggle(user.id, user.isBanned)} className={styles.banBtn}>
                  {user.isBanned ? 'Unban' : 'Ban'}
                </button>
                <select value={user.role} onChange={(e) => handleRoleChange(user.id, e.target.value)} className={styles.roleSelect}>
                  {roles.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        )}
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
