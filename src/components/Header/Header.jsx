import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import logo from '../../assets/images/logo.png';
import { logout } from '../../actions/auth';
import styles from './Header.module.css';
import LoginModal from '../LoginModal/LoginModal';
import SignupModal from '../SignupModal/SignupModal';

const Header = () => {
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.auth.userData);

  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
  };

  const openLoginModal = () => setIsLoginOpen(true);
  const closeLoginModal = () => setIsLoginOpen(false);
  const openSignupModal = () => setIsSignupOpen(true);
  const closeSignupModal = () => setIsSignupOpen(false);

  const toggleDropdown = () => setIsDropdownOpen((prev) => !prev);

  function greetingsNameFromEmail(email) {
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
        <Link to="/" className={styles.navItem}>Main</Link>
        <Link to="/courses" className={styles.navItem}>Courses</Link>
        <Link to="/about" className={styles.navItem}>About</Link>
        <Link to="/contact" className={styles.navItem}>Contact</Link>
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
                <Link to="/profile" className={styles.dropdownItem}>My Profile</Link>
                <Link to="/my_courses" className={styles.dropdownItem}>My Courses</Link>
                <span onClick={handleLogout} className={styles.dropdownItem}>Logout</span>
              </div>
            )}
          </div>
        ) : (
          <>
            <span onClick={openLoginModal} className={styles.navItem}>Login</span>
            <span onClick={openSignupModal} className={styles.navItem}>Signup</span>
          </>
        )}
      </nav>

      {isLoginOpen && <LoginModal onClose={closeLoginModal} />}
      {isSignupOpen && <SignupModal onClose={closeSignupModal} />}
    </header>
  );
};

export default Header;
