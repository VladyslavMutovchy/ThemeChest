import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import logo from '../../assets/images/logo.png';
import { logout } from '../../actions/auth';
import styles from './Header.module.css';
import LoginModal from '../LoginModal/LoginModal';
import SignupModal from '../SignupModal/SignupModal';
import { getUserData } from '../../actions/profile';



const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userData = useSelector((state) => state.auth.userData);

  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [dropdownTimeout, setDropdownTimeout] = useState(null);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const openLoginModal = () => setIsLoginOpen(true);
  const closeLoginModal = () => setIsLoginOpen(false);
  const openSignupModal = () => setIsSignupOpen(true);
  const closeSignupModal = () => setIsSignupOpen(false);

  const toggleDropdown = () => {
    if (dropdownTimeout) {
      clearTimeout(dropdownTimeout);
      setDropdownTimeout(null);
    }

    setIsDropdownOpen((prev) => !prev);

    if (!isDropdownOpen) {
      const timeout = setTimeout(() => {
        setIsDropdownOpen(false);
      }, 4000);
      setDropdownTimeout(timeout);
    }
  };

  const closeDropdown = () => {
    if (dropdownTimeout) {
      clearTimeout(dropdownTimeout);
      setDropdownTimeout(null);
    }
    setIsDropdownOpen(false);
  };

  useEffect(() => {
    return () => {
      if (dropdownTimeout) {
        clearTimeout(dropdownTimeout);
      }
    };
  }, [dropdownTimeout]);

  function greetingsNameFromEmail(email) {
    if (!email) {
      return;
    }
    const atIndex = email.indexOf('@');
    return atIndex !== -1 ? email.slice(0, atIndex) : email;
  }

  return (
    <header className={styles.header}>
      <Link to="/">
        <img className={styles.logo} src={logo} alt="logo" />
      </Link>
      <h1 className={styles.h1}>ThemeChest</h1>
      <nav className={styles.nav}>
        <Link to="/" className={styles.navItem}>
          Main
        </Link>
        <Link to="/guides" className={styles.navItem}>
          Guides
        </Link>

        <Link to="/contact" className={styles.navItem}>
          Contact
        </Link>
        {userData ? (
          <div className={styles.userMenu}>
            <span onClick={toggleDropdown} className={styles.navItemHello}>
              Hello, {!userData.name ? greetingsNameFromEmail(userData.email) : userData.name}!
            </span>
            <div onClick={toggleDropdown} className="dropdown_menu_strings">
              <div></div>
              <div></div>
              <div></div>
            </div>
            {isDropdownOpen && (
              <div className={`${styles.dropdown} ${isDropdownOpen ? styles.open : ''}`}>
                <Link to="/profile" className={styles.dropdownItem} onClick={toggleDropdown}>
                  My Profile
                </Link>
                <Link to="/favorites" className={styles.dropdownItem} onClick={toggleDropdown}>
                  Favorites
                </Link>
                <Link to="/creator" className={styles.dropdownItem} onClick={toggleDropdown}>
                  Creator
                </Link>
                <Link
                  to="#"
                  className={styles.dropdownItem}
                  onClick={(e) => {
                    e.preventDefault();
                    toggleDropdown();
                    handleLogout();
                  }}
                >
                  Logout
                </Link>
              </div>
            )}
          </div>
        ) : (
          <>
            <span onClick={openLoginModal} className={styles.navItem}>
              Login
            </span>
            <span onClick={openSignupModal} className={styles.navItem}>
              Signup
            </span>
          </>
        )}
      </nav>

      {isLoginOpen && <LoginModal onClose={closeLoginModal} />}
      {isSignupOpen && <SignupModal onClose={closeSignupModal} />}
    </header>
  );
};

export default Header;
