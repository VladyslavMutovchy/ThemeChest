import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import logo from '../../assets/images/logo.png';
import { logout } from '../../actions/auth';
import styles from './Header.module.css';
import LoginModal from '../LoginModal/LoginModal';
import SignupModal from '../SignupModal/SignupModal';
import { getRoleFromToken } from '../../utils/functions';
import { Button } from '../UI';

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);

  const userData = useSelector((state) => state.auth.userData);

  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [role, setRole] = useState(null);

  const openLoginModal = () => setIsLoginOpen(true);
  const closeLoginModal = () => setIsLoginOpen(false);
  const openSignupModal = () => setIsSignupOpen(true);
  const closeSignupModal = () => setIsSignupOpen(false);
  const toggleMobileMenu = () => setIsMobileMenuOpen(prev => !prev);

  // Определяем активную страницу
  const isActive = (path) => {
    return location.pathname === path;
  };

  useEffect(() => {
    if (userData?.token) {
      const roleId = getRoleFromToken(userData.token);
      setRole(roleId);
    } else {
      setRole(null);
    }
  }, [userData]);

  // Закрываем мобильное меню при изменении маршрута
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  // Закрываем выпадающее меню при клике вне его
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
    setIsDropdownOpen(false);
  };

  const greetingsNameFromEmail = (email) => {
    if (!email) return '';
    const atIndex = email.indexOf('@');
    return atIndex !== -1 ? email.slice(0, atIndex) : email;
  };

  return (
    <header className={styles.header}>
      <div className={styles.headerContainer}>
        <div className={styles.logoContainer}>
          <Link to="/" className={styles.logoLink}>
            <img className={styles.logo} src={logo} alt="ThemeChest Logo" />
            <h1 className={styles.title}>ThemeChest</h1>
          </Link>
        </div>

        <button className={styles.mobileMenuButton} onClick={toggleMobileMenu} aria-label="Toggle menu">
          <span className={styles.menuIcon}></span>
        </button>

        <nav className={`${styles.nav} ${isMobileMenuOpen ? styles.mobileOpen : ''}`}>
          <div className={styles.navLinks}>
            <Link to="/" className={`${styles.navItem} ${isActive('/') ? styles.active : ''}`}>
              Main
            </Link>
            <Link to="/guides" className={`${styles.navItem} ${isActive('/guides') ? styles.active : ''}`}>
              Guides
            </Link>
            <Link to="/AiCreator" className={`${styles.navItem} ${isActive('/AiCreator') ? styles.active : ''}`}>
              AI Creator
            </Link>
          </div>

          <div className={styles.authSection}>
            {userData ? (
              <div className={styles.userMenu} ref={dropdownRef}>
                <button onClick={toggleDropdown} className={styles.userButton}>
                  <span className={styles.userName}>
                    {userData.name || greetingsNameFromEmail(userData.email)}
                  </span>
                  <span className={`${styles.dropdownArrow} ${isDropdownOpen ? styles.open : ''}`}></span>
                </button>

                {isDropdownOpen && (
                  <div className={styles.dropdown}>
                    <Link to="/profile" className={styles.dropdownItem}>
                      My Profile
                    </Link>
                    <Link to="/guides" className={styles.dropdownItem}>
                      Favorites
                    </Link>
                    <Link to="/creator" className={styles.dropdownItem}>
                      Creator
                    </Link>
                    {role === 1 && (
                      <Link to="/admin_list" className={styles.dropdownItem}>
                        Admin List
                      </Link>
                    )}
                    <button
                      className={styles.dropdownItem}
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className={styles.authButtons}>
                <Button
                  variant="outline"
                  size="small"
                  onClick={openLoginModal}
                  className={styles.loginButton}
                >
                  Login
                </Button>
                <Button
                  variant="primary"
                  size="small"
                  onClick={openSignupModal}
                >
                  Sign Up
                </Button>
              </div>
            )}
          </div>
        </nav>
      </div>

      {isLoginOpen && <LoginModal onClose={closeLoginModal} />}
      {isSignupOpen && <SignupModal onClose={closeSignupModal} />}
    </header>
  );
};

export default Header;
