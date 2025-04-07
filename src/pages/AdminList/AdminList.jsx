import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { changeUserRole, banUser, unbanUser, fetchUsers } from '../../actions/admin';
import styles from './AdminList.module.css';
import { getRoleFromToken } from '../../utils/functions';
import { Button, Card, Input } from '../../components/UI';

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

  const isAdmin = userData.roles?.some((role) => role.value === 'admin');

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
    <div className={styles.adminPage}>
      <div className={styles.adminHeader}>
        <div className={styles.container}>
          <h1 className={styles.pageTitle}>Admin Panel</h1>
          <p className={styles.pageDescription}>
            Manage users, roles, and permissions
          </p>
        </div>
      </div>

      <div className={styles.adminContent}>
        <div className={styles.container}>
          <Card className={styles.adminCard}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>User Management</h2>
              <div className={styles.searchContainer}>
                <div className={styles.searchInputWrapper}>
                  <Input
                    type="text"
                    placeholder="Search by email or ID..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={styles.searchInput}
                  />
                </div>
                <Button
                  variant="primary"
                  onClick={handleSearch}
                  className={styles.searchButton}
                >
                  Search
                </Button>
              </div>
            </div>

            {users.length === 0 ? (
              <div className={styles.noResults}>
                <p>No users found matching your search criteria.</p>
              </div>
            ) : (
              <div className={styles.userList}>
                {users.map((user) => (
                  <div key={user.id} className={styles.userCard}>
                    <div className={styles.userInfo}>
                      <div className={styles.userIdEmail}>
                        <span className={styles.userId}>ID: {user.id}</span>
                        <span className={styles.userEmail}>{user.email}</span>
                      </div>
                      <div className={styles.userRoleStatus}>
                        <span className={styles.userRole}>
                          Role: {user.roles?.map((role) => role.value).join(', ') || 'No roles assigned'}
                        </span> -
                        <span className={`${styles.userStatus} ${user.banned ? styles.bannedStatus : styles.activeStatus}`}>
                          {user.banned ? 'Banned' : 'Active'}
                        </span>
                      </div>
                    </div>

                    <div className={styles.userActions}>
                      <Button
                        variant={user.banned ? "outline" : "secondary"}
                        size="small"
                        onClick={() => handleBanToggle(user.id, user.banned)}
                        disabled={isAdmin && userData?.email === user.email}
                        className={styles.actionButton}
                      >
                        {user.banned ? 'Unban' : 'Ban'}
                      </Button>

                      <select
                        value={user.roles[0]?.value || 'user'}
                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                        className={styles.roleSelect}
                        disabled={user.roles?.some((role) => role.value === 'admin') && userData?.email === user.email}
                      >
                        {roles.map((role) => (
                          <option key={role} value={role}>
                            {role.charAt(0).toUpperCase() + role.slice(1)}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!loading && users.length < total && (
              <div className={styles.loadMoreContainer}>
                <Button
                  variant="outline"
                  onClick={() => loadUsers(page + 1, false, searchQuery)}
                >
                  Load More Users
                </Button>
              </div>
            )}
          </Card>
        </div>
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
