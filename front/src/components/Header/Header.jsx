import React from 'react';
import { Link } from 'react-router-dom';


import styles from './Header.module.css';

const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.mobileMenu} />
      <div className={styles.menuWrapper}>
      </div>
      <Link to="/" className={styles.logo} />
      <button className={styles.getStarted} >
        Get started
      </button>
    </header>
  );
};

export default Header;
